import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Action } from '../../casl/userRoles';
import { Auth, AuthUser, Public } from '../../decorators';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { TokenPayloadDto } from './dto/TokenPayloadDto';
import { CreateUserLoginDto } from '../user/dto/create-user-login.dto';
import { UserForgetPasswordDto } from '../user/dto/user-forget-email.dto';
import { UserNewPasswordDto } from '../user/dto/user-forget-password.dto';
import { RevisedPasswordDto } from '../user/dto/account-revised-password.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: 'any',
    description: 'User info with access token',
  })
  @ApiBody({ description: 'User Login', type: CreateUserLoginDto })
  async userLogin(@Body() userLoginDto: any): Promise<TokenPayloadDto> {
    const userEntity: User = await this.authService.validateUser(userLoginDto);
    const token = await this.authService.createAccessToken(userEntity);
    return token;
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: User, description: 'Successfully Registered' })
  async userRegister(@Body() userRegisterDto: User): Promise<User> {
    return await this.userService.createUser(userRegisterDto);
  }

  // Forget Password
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('forget-password')
  @ApiBody({ description: 'Forget Password', type: UserForgetPasswordDto })
  async forgetPssword(@Body() body: any) {
    return this.authService.forgetPsswordApi(body);
  }

  // Reset Password
  @Patch('reset-password')
  @Auth(Action.Read, 'User')
  @ApiBody({ description: 'Reset Password', type: UserNewPasswordDto })
  async resetPassword(@Body() body: any, @AuthUser() user: User) {
    const userId = user.id;
    return this.userService.resetPassword(body, userId);
  }
  // Edit Your Account
  @Patch('edit-account')
  @HttpCode(HttpStatus.OK)
  @Auth(Action.Read, 'User')
  @ApiBody({ required: true, type: User })
  @ApiOkResponse({ type: User, description: 'Edit User/Account info' })
  editUserAccount(@AuthUser() user: User, @Body() body: any) {
    return this.userService.updateUser(user.id, body);
  }

  // Edit Your Account Password Or revised Password
  @Patch('revised-password')
  @HttpCode(HttpStatus.OK)
  @Auth(Action.Read, 'User')
  @ApiBody({ required: true, type: RevisedPasswordDto })
  @ApiOkResponse({
    type: RevisedPasswordDto,
    description: 'Edit Account Password',
  })
  revisedPassword(@AuthUser() user: User, @Body() body: any) {
    return this.userService.rewisedPassword(user.id, body);
  }
  // @Version('1')
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @Auth(Action.Read, 'User')
  @ApiOkResponse({ type: User, description: 'Get Current User Info' })
  getCurrentUser(@AuthUser() user: User): User {
    return user;
  }

  @Patch('edit-customer')
  @HttpCode(HttpStatus.OK)
  @Auth(Action.Read, 'User')
  @ApiBody({ required: true, type: User })
  @ApiOkResponse({ type: User, description: 'Edit Customer Account' })
  editCustomer(
    @AuthUser() user: User,
    @Query('id') id: number,
    @Body() body: any,
  ) {
    if (user.role === 'ADMIN') {
      return this.userService.updateUser(Number(id), body);
    }
  }
}
