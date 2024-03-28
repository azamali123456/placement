import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { JobApplicationModule} from './modules/application/application.module'
import { ContactUsModule} from './modules/contactus/contactus.module'
import { PaymentModule } from './modules/payment/payment.module';
// import { QuickbookModule} from './modules/invoice/quickbook.module'
import { ServicsModule} from './modules/services/services.module'
import {PakagesModule } from './modules/pakages/pakages.module'
@Module({
  imports: [
    ConfigrationModule,
        ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'placementservie.cfkoou48ia6y.eu-north-1.rds.amazonaws.com',
      port: 3306,
      username: 'admin',
      password: '22P$Usa112',
       database: 'dev',
    // database: 'placementservicesdb',
      synchronize: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // "logging": true
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
export class AppModule {}
