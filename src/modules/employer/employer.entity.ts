import { IsInt } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { Job } from '../job/job.entity';
@Entity()
export class EmployerInfo {
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column()
  companyName!: string;

  @ApiProperty()
  @Column()
  noOfEmployee!: string;

  @ApiProperty()
  @Column()
  hiringManager!: string;

  @ApiProperty()
  @Column()
  hiringManagerTitle!: string;

  @ApiProperty()
  @Column()
  companyNature!: string;

  @ApiProperty()
  @Column()
  worksiteStreet!: string;

  @ApiProperty()
  @Column()
  worksiteCity!: string;

  @ApiProperty()
  @Column()
  state!: string;

  @Column()
  @IsInt()
  worksiteZipCode!: number;

  @OneToMany(() => Job, (job) => job.employerId)
  jobs: Job[];
}
