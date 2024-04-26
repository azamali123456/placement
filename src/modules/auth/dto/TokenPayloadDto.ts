import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/user.entity';
export class TokenPayloadDto {
  @ApiProperty()
  expiresIn: number;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  user: User;

  constructor(data: { expiresIn?: number; accessToken: string; user: any }) {
    this.expiresIn = data.expiresIn;
    this.accessToken = data.accessToken;
    this.user = data.user;
  }
}
