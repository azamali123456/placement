import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Job } from '../job/job.entity';

@Entity()
export class Pakages extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column({ nullable: true })
  title!: string;

  @ApiProperty()
  @Column({ nullable: true })
  price!: number;

  @ApiProperty()
  @Column({ nullable: true })
  discription!: string;

  @OneToMany(() => Job, (job) => job.packages) // Define the inverse relation to Job entity
  jobs: Job[];
}
