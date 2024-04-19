// src/module/user/dto/create-user.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RevisedPasswordDto {
  @ApiProperty({ default: '123456' }) // Specify default value here
  @IsString()
  @IsEmail()
  current_password: string;

  @ApiProperty({ default: '123456' }) // Specify default value here
  @IsString()
  @MinLength(5)
  new_password: string;
}
