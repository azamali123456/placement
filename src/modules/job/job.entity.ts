import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { JobStatus } from '../../constants/module-contants';
import { IsInt, Min, Max, IsBoolean, IsOptional } from 'class-validator';
import { EmployerInfo } from '../employer/employer.entity';
import { Payment } from '../payment/payment.entity'
import { Pakages } from '../pakages/pakages.entity';
import { ApiProperty } from '@nestjs/swagger';
@Entity()
export class Job extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column()
  @IsInt()
  packagesId!: number;

  @ApiProperty()
  @Column()
  @IsInt()
  userId!: number;

  @ApiProperty()
  @Column()
  jobTitle!: string;

  @ApiProperty()
  @Column({ nullable: true })
  jobNumber!: number;

  @ApiProperty()
  @Column()
  @IsBoolean()
  multiPosition!: boolean;

  @ApiProperty()
  @Column()
  @IsBoolean()
  telecommuting!: boolean;

  @ApiProperty()
  @Column("text")
  discription!: string;

  @ApiProperty()
  @Column("text")
  educationAndExperience!: string;

  @ApiProperty()
  @Column("text")
  specialSkills!: string;

  @ApiProperty()
  @Column("text")
  travelRequirements!: string;

  @ApiProperty()
  @Column()
  remoteJob!: string;

  @ApiProperty()
  @Column()
  @IsOptional()
  jobType!: string;

  @ApiProperty()
  @Column({ default: "0" })
  salary!: string;

  @ApiProperty()
  @Column()
  @IsInt()
  @Min(1, { message: 'Job duration must be at least 0' })
  @Max(30, { message: 'Job duration cannot exceed 30' })
  jobDuration!: number;

  @ApiProperty()
  @Column({
    type: 'date',
    default: null, // Set the default to null
    nullable: true, // Allow the column to be nullable
  })
  startDate!: Date;

  @ApiProperty()
  @Column({
    type: 'date',
  })
  endDate!: Date;


  @ApiProperty()
  @Column({
    type: 'date',
    default: null, // Set the default to null
    nullable: true, // Allow the column to be nullable
  })
  submittedDate: Date;

  @ApiProperty()
  @Column()
  employerId!: number;

  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  requiredSkills: string[];

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.SAVED,
  })
  status!: JobStatus;

  @ApiProperty()
  @Column("text")
  specialInstructions!: string;

  @ApiProperty()
  @Column()
  recruitmentFirm!: string;

  @ApiProperty()
  @Column()
  referenceCode!: number;

  @ApiProperty()
  @Column()
  LengthOfRecruitment!: number;

  @ApiProperty()
  @Column()
  @IsBoolean()
  @IsOptional()
  toApplyStatus!: boolean;

  @ApiProperty()
  @Column({
    type: 'boolean',
    default: false,
  })
  @IsBoolean()
  varify!: boolean;

  @ApiProperty()
  @Column()
  @IsOptional()
  toApplyText!: string;

  // @ApiProperty()
  // @Column({ default: false })
  // @IsBoolean()
  // addToCard: boolean;

  @ApiProperty()
  @ManyToOne(() => EmployerInfo)
  @JoinColumn({ name: 'employerId' })
  employerInfo!: EmployerInfo;



  @OneToMany(() => Payment, (payment) => payment.job)
  payments!: Payment[];

  @ApiProperty()
  @ManyToOne(() => Pakages)
  @JoinColumn({ name: 'packagesId' })
  packages!: Pakages;




  @BeforeInsert()
  setDefaultSubmittedDate() {
    this.submittedDate = new Date();
    // this.startDate = new Date(); // Set the default value on insert
  }
}
