import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
} from 'typeorm';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Job } from '../job/job.entity';

@Entity()
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column({ nullable: true })
  @IsOptional()
  object!: string;

  @ApiProperty()
  @Column({
    type: 'boolean',
    default: false,
  })
  @IsBoolean()
  varify!: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  @IsOptional()
  amount!: number;

  @ApiProperty()
  @Column({ nullable: true })
  @IsOptional()
  amount_captured!: number;

  @ApiProperty()
  @Column({ nullable: true })
  @IsOptional()
  amount_refunded!: number;

  @ApiProperty()
  @Column({ nullable: true })
  @IsOptional()
  balance_transaction!: string;

  @ApiProperty()
  @Column({ nullable: true })
  @IsOptional()
  receipt_url!: string;
  // Billing Details
  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  @IsOptional()
  billing_details!: {
    address: {
      city: string | null;
      country: string | null;
      line1: string | null;
      line2: string | null;
      postal_code: string;
      state: string | null;
    };
    email: string | null;
    name: string | null;
    phone: string | null;
  };

  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  @IsOptional()
  metadata!: {
    jobId: number | null;
    userId: number | null;
  };

  @ApiProperty()
  @Column({ nullable: true })
  @IsOptional()
  created!: number;

  @ApiProperty()
  @Column({ nullable: true })
  @IsOptional()
  currency!: string;

  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  @IsOptional()
  customer: object;

  @ApiProperty()
  @Column({ nullable: true })
  @IsOptional()
  invoice!: string;

  @ApiProperty()
  @Column({ nullable: true })
  @IsOptional()
  paid!: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  @IsOptional()
  payment_intent!: string;

  @ApiProperty()
  @Column({ nullable: true })
  @IsOptional()
  payment_method!: string;

  // Payment Method Details
  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  @IsOptional()
  payment_method_details!: {
    card: {
      amount_authorized: number;
      brand: string;
      checks: {
        address_line1_check: string | null;
        address_postal_code_check: string;
        cvc_check: string;
      };
      country: string;
      exp_month: number;
      exp_year: number;
      extended_authorization?: any;
      fingerprint?: string;
      funding?: string;
      incremental_authorization?: any;
      installments?: number | null;
      last4: string;
      mandate?: any;
      multicapture?: any;
      network: string;
      network_token?: any;
      overcapture?: any;
      three_d_secure?: any;
      wallet?: any;
    };
    type: string;
  };

  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  @IsOptional()
  billingAddress!: {
    firstName: string;
    lastName: string;
    address: string;
    company: string;
    city: string;
    state: string;
    zipCode: number;
  };

  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  @IsOptional()
  billingMethod!: {
    type: string;
    email: string;
  };

  @ApiProperty()
  @Column({ nullable: true })
  @IsOptional()
  receipt_email!: string;

  @ApiProperty()
  @Column({ nullable: true })
  @IsOptional()
  refunded!: boolean;

  // Payment entity

  @ManyToOne(() => Job, (job) => job.payments)
  // @JoinColumn({ name: 'jobId', referencedColumnName: 'id' })
  job: Job;

  // @ApiProperty()
  // @ManyToOne(() => Job)
  // @JoinColumn({ name: 'jobId' })
  // job!: Job;

  @ApiProperty()
  @Column({ nullable: true })
  jobId!: number;
}
