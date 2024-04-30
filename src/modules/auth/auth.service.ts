import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import type { User } from '../user/user.entity';
import { TokenPayloadDto } from './dto/TokenPayloadDto';
import { TokenType } from '../../constants';
import * as bcrypt from 'bcrypt';
import { ResponseCode } from 'src/exceptions';
import { MailService } from '../mail/mail.service';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private readonly mailServices: MailService,
  ) {}
  async createAccessToken(user: User): Promise<TokenPayloadDto> {
    delete user.users_password;
    return new TokenPayloadDto({
      user,
      accessToken: await this.jwtService.signAsync({
        id: user.id,
        type: TokenType.ACCESS_TOKEN,
        role: user.role,
      }),
    });
  }

  async validateUser(userLoginDto: User): Promise<User> {
    const user: User = <User>await this.userService.findByEmail(userLoginDto);

    if (
      user &&
      (await bcrypt.compare(userLoginDto.users_password, user.users_password))
    ) {
      return user;
    }
    throw new HttpException(
      'Email or password does not match',
      ResponseCode.BAD_REQUEST,
    );
  }
  // Forget Pssword
  async forgetPsswordApi(userDto: any): Promise<any> {
    try {
      const user: any = await this.userService.findByEmail({
        users_email: userDto.email ? userDto.email : userDto.users_email,
      });
      if (user == null) {
        throw new HttpException(
          'No such user exists, enter correct email',
          ResponseCode.BAD_REQUEST,
        );
      } else {
        const tokenData = await this.createAccessToken(user);
        // if (userDto?.redirectUrl && user.role === 'ADMIN') {
        // Mail Config
        const mailBody = `<html>
 <body>
 <div style="background-color: #4CAF50; padding: 10px;">
   <img width="40" height="40" src="https://staging3.placement-services.com/wp-content/uploads/2019/11/logo.png"  style="max-width: 100%; height: auto;">
   <strong style="position:relative; top:-10px; left:5px; font-size: 20px; font-weight: 700; color:#ffa500;">Placement Services USA</strong>    
 </div>
 <h2>Password Reset Request</h2>
 <p>
   Someone has requested a new password for the account on Placement Services USA, Inc. associated with this email address.
   If you didn't make this request, please ignore this email.
 </p>
 <p>
   If you would like to reset your password,
   <a href='${
     userDto?.redirectUrl
       ? userDto?.redirectUrl
       : 'https://placement-services-venrup.web.app/reset-password'
   }/${
          tokenData['accessToken']
        }' style="background-color:#6082B6; padding: 4px; color: aliceblue; text-decoration: none;">CLICK HERE</a>.
 </p>
 </body>
</html>`;
        const mailHeading = `Password Reset Request for Placement Services USA, Inc.`;
        const subject = `Password Reset Request for Placement Services USA, Inc.`;
        const mailResponse = await this.mailServices.sendNewMail(
          user.users_email,
          process.env.COMPANY_EMAIL,
          subject,
          mailHeading,
          mailBody,
          [],
        );
        return {
          message: 'Email has been send!',
          token: tokenData['accessToken'],
          mailResponse: mailResponse,
        };
        // } else {
        //   throw new HttpException('Only Admin can Reset there password through Dashboard!', ResponseCode.BAD_REQUEST);
        // }
      }
    } catch (err) {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    }
  }
}
