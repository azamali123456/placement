import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  BeforeInsert,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import {
  IsInt,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { userType } from 'src/constants';
import { Job } from '../job/job.entity';
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: string;

  @ApiProperty()
  @Column({ unique: true })
  @IsDefined()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  users_email: string;

  @ApiProperty()
  @Column()
  @IsDefined()
  @IsNotEmpty({ message: 'Password should not be empty' })
  users_password: string;

  @ApiProperty()
  @Column()
  @IsDefined()
  @IsNotEmpty({ message: 'firstName should not be empty' })
  firstName: string;

  @ApiProperty()
  @Column()
  @IsDefined()
  @IsNotEmpty({ message: 'lastName should not be empty' })
  lastName: string;

  @ApiProperty()
  @Column()
  @IsDefined()
  @IsNotEmpty({ message: 'companyName should not be empty' })
  companyName: string;

  @ApiProperty()
  @Column()
  @IsDefined()
  @IsNotEmpty({ message: 'phone should not be empty' })
  phone: string;

  @ApiProperty()
  @Column()
  @IsDefined()
  @IsNotEmpty({ message: 'address should not be empty' })
  address: string;

  @ApiProperty()
  @Column()
  @IsDefined()
  @IsNotEmpty({ message: 'city/State should not be empty' })
  city: string;

  @ApiProperty()
  @Column()
  @IsInt()
  @IsDefined()
  @IsNotEmpty({ message: 'zipCode should not be empty' })
  zipCode: number;

  @Column({ default: userType.EMPLOYER })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiProperty()
  @Column({  type: 'datetime'  })
  registerDate: Date;

  @Column()
  @IsString()
  @IsOptional()
  address2?: string;

  @Column()
  @IsString()
  @IsOptional()
  faxNumber?: string;

  @Column()
  @IsString()
  @IsOptional()
  country?: string;

  @Column()
  @IsString()
  @IsOptional()
  customerType?: string;

  @Column()
  @IsNumber()
  @IsOptional()
  customerDiscount?: number;

  @Column()
  @IsNumber()
  @IsOptional()
  rewardPoints?: number;

  @Column()
  @IsString()
  @IsOptional()
  hearFrom?: string;

  @Column()
  @IsString()
  @IsOptional()
  referredBy?: string;

  @Column()
  @IsBoolean()
  @IsOptional()
  newsletter?: boolean;

  @OneToMany(() => Job, (job) => job.user) // Define the inverse relation to Job entity
  jobs: Job[];

  @BeforeInsert()
  setDefaultSubmittedDate() {
    // Get the current date and time in the USA time zone
    const usaTime = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
    // Parse the string representation back into a Date object
    this.registerDate = new Date(usaTime);
  }
}
