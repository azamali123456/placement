import { Module } from '@nestjs/common';
import { JobApplicationService } from '../application/application.service';
import { JapplicationController } from './application.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './application.entity';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([Application]),
    JwtModule.register({
      secret: 'your_secret_key', // Provide a valid secret key
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [JapplicationController],
  providers: [JobApplicationService, MailService],
  exports: [JobApplicationService, MailService],
})
export class JobApplicationModule {}
