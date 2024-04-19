import { ApiProperty } from '@nestjs/swagger';
export class PakagesPayloadDto {
  @ApiProperty()
  title!: string;

  @ApiProperty()
  price!: number;

  @ApiProperty()
  discription!: string;
}
