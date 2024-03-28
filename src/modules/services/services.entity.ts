import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Job } from '../job/job.entity';

@Entity()
export class Services extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column({ nullable: true })
  title!: string;

  @ApiProperty()
  @Column('simple-array', { nullable: true }) 
  pakages!: number[];

}


