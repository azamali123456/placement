import { ApiProperty } from '@nestjs/swagger';
export class PaymentPayloadDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  discription: string;

  @ApiProperty()
  jobId: number;

  @ApiProperty()
  userId: number;
}
