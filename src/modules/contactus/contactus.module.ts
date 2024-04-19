import { Module } from '@nestjs/common';
import { ContactUsService } from './contactus.service';
import { ContactUsController } from './contactus.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contactus } from './contactus.entity';
import { MailService } from '../mail/mail.service';
@Module({
  imports: [TypeOrmModule.forFeature([Contactus])],
  controllers: [ContactUsController],
  providers: [ContactUsService, MailService],
  exports: [ContactUsService, MailService],
})
export class ContactUsModule {}
