import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Contactus } from './contactus.entity';
import { ResponseCode } from 'src/exceptions';
import { MailService } from '../mail/mail.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ContactUsService {
  constructor(
    @InjectRepository(Contactus)
    private readonly contactUsRepository: Repository<Contactus>,
    @Inject(MailService)
    private readonly mailServices: MailService,
  ) {}
  // Contact Us
  async contactUs(contactDto: any): Promise<any> {
    try {
      const userInstance = plainToClass(Contactus, contactDto);
      const validationErrors = await validate(userInstance);
      if (validationErrors.length > 0) {
        throw new BadRequestException(validationErrors[0]);
      } else {
        const body = `<html>
      <body>
       <div style="display:flex"><h5 style="padding-right:4px;font-weight:900;">Email : </h5> <h5> ${
         contactDto.email
       }</h5></div> 
       <div style="display:flex"> <h5 style="padding-right:4px;font-weight:900;">Name : </h5> <h5>${
         contactDto.firstName + ' ' + contactDto.lastName
       }</h5></div>
       <div style="display:flex">  <h5 style="padding-right:4px;font-weight:900;">Company : </h5> <h5>${
         contactDto.companyName
       }</h5></div>
       <div style="display:flex">  <h5 style="padding-right:4px;font-weight:900;">Query :</h5> <h5>${
         contactDto.message
       }</h5></div>
      </body>
    </html>`;
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so add 1
        const day = currentDate.getDate().toString().padStart(2, '0');

        const heading = `Contact with Placement Services USA, Inc.`;
        const subject = ` CONTACT US ${year}.${month}.${day} ${contactDto.firstName} ${contactDto.lastName}  `;
        return await this.mailServices.sendNewMail(
          process.env.COMPANY_EMAIL,
          process.env.COMPANY_EMAIL,
          subject,
          heading,
          body,
          [],
        );
      }
    } catch (err) {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    }
  }
}
