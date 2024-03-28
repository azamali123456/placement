import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import {
  IsInt,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
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
  @IsNotEmpty({ message: 'city should not be empty' })
  city: string;

  @ApiProperty()
  @Column()
  @IsInt()
  @IsDefined()
  @IsNotEmpty({ message: 'zipCode should not be empty' })
  zipCode: number;

  @Column({ default: 'Employeer' })
  @IsString()
  @IsOptional()
  role?: string;
}
