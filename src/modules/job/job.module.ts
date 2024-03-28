import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './job.entity';
import { JwtModule } from '@nestjs/jwt';
import { EmployerModule } from '../employer/employer.module';
import { EmployerInfo } from '../employer/employer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, EmployerInfo]),
    JwtModule.register({
      secret: 'your_secret_key', // Provide a valid secret key
      signOptions: { expiresIn: '1h' },
    }),
    EmployerModule,
  ],
  controllers: [JobController],
  providers: [JobService],
  exports: [JobService],
})
export class JobModule {}
