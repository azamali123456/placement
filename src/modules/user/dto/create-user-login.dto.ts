// src/module/user/dto/create-user.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserLoginDto {
  @ApiProperty({ default: 'example@gmail.com' }) // Specify default value here
  @IsString()
  @IsEmail()
  users_email: string;

  @ApiProperty({ default: '123456' }) // Specify default value here
  @IsString()
  @MinLength(5)
  users_password: string;
}
