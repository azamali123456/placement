// src/module/user/dto/create-user.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ default: 'example@gmail.com' }) // Specify default value here
  @IsString()
  @IsEmail()
  users_email: string;

  @ApiProperty({ default: '123456' }) // Specify default value here
  @IsString()
  @MinLength(5)
  users_password: string;

  @ApiProperty({ default: 'Peter' })
  @IsString()
  firstName: string;

  @ApiProperty({ default: 'Peter' })
  @IsString()
  lastName: string;

  @ApiProperty({ default: 'Peter Work Space' })
  @IsString()
  companyName: string;

  @ApiProperty({ default: '03326754886' })
  @IsString()
  phone: string;

  @ApiProperty({ default: 'Any Address Here' })
  @IsString()
  address: string;

  @ApiProperty({ default: 'New Yark' })
  @IsString()
  city: string;

  @ApiProperty({ default: '15445' })
  @IsNumber()
  zipCode: number;
}
