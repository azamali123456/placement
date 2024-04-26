import { Module } from '@nestjs/common';
import { ServicsService } from './pakages.service';
import { PakagesController } from './pakges.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pakages } from './pakages.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pakages])],
  controllers: [PakagesController],
  providers: [ServicsService],
  exports: [ServicsService],
})
export class PakagesModule {}
