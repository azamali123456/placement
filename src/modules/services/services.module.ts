import { Module } from '@nestjs/common';
import { ServicsService } from './services.service';
import { ServicsController } from './services.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from './services.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Services])],
  controllers: [ServicsController],
  providers: [ServicsService],
  exports: [ServicsService],
})
export class ServicsModule {}
