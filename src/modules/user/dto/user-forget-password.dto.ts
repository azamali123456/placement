// src/module/user/dto/create-user.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UserNewPasswordDto {
  @ApiProperty({ default: 'New-password' }) // Specify default value here
  @IsString()
  @IsEmail()
  users_password: string;
}
