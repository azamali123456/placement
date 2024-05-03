import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { ConfigrationModule } from './configration/configration.module';
import { LoggerModule } from './logger/logger.module';
import { AuthModule } from './modules/auth/auth.module';
import { CaslModule } from './casl/casl.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobModule } from './modules/job/job.module';
import { EmployerModule } from './modules/employer/employer.module';
import { JobApplicationModule } from './modules/application/application.module';
import { ContactUsModule } from './modules/contactus/contactus.module';
import { PaymentModule } from './modules/payment/payment.module';
// import { QuickbookModule} from './modules/invoice/quickbook.module'
import { ServicsModule } from './modules/services/services.module';
import { PakagesModule } from './modules/pakages/pakages.module';
@Module({
  imports: [
    ConfigrationModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      //  host: 'sql.freedb.tech', // Local
      host: 'sql.freedb.tech', // live
      port: 3306,
      // username: 'freedb_imran', // Local
      // password: '9rs2VkcQKjgz3&?', // Local
      // database: 'freedb_placement', // Local

      username: 'freedb_imranProd', // Live
      password: 'wYhs4Cs3Yt6#R5$', // Live
      database: 'freedb_placementProd', // Live
      synchronize: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      //  "logging": true
    }),
    PaymentModule,
    // QuickbookModule,
    PakagesModule,
    ServicsModule,
    LoggerModule,
    AuthModule,
    CaslModule,
    UserModule,
    JobModule,
    EmployerModule,
    JobApplicationModule,
    ContactUsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppModule],
})
export class AppModule { }
