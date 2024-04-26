// src/module/user/dto/create-user.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UserForgetPasswordDto {
  @ApiProperty({ default: 'example@gmail.com' }) // Specify default value here
  @IsString()
  @IsEmail()
  users_email: string;
}
