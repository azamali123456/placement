import { ApiProperty } from '@nestjs/swagger';
export class ServicesPayloadDto {
  @ApiProperty()
  title!: string;

  @ApiProperty({ default: [1] })
  pakages!: number[];
}
