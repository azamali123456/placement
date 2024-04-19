import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentPayloadDto } from './dto/paymentDto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
@Controller('/checkout')
@ApiTags('checkout')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  // Create Checkout Now
  @Post('/returnme')
  @ApiBody({ description: 'Contact Us' })
  async createme(@Body() body: any) {
    return this.paymentService.savedPayment(body);
  }
  // Create Instant Now
  // @Post('/create-instant')
  // @ApiBody({ description: 'Create Stripe Instant ', type: PaymentPayloadDto })
  // async create(@Body() body: any,): Promise<Stripe.PaymentIntent> {
  //     return this.paymentService.createCheckoutInstant(body);
  // }

  @Post('/create-instant')
  @ApiBody({ description: 'Create Stripe Instant ', type: PaymentPayloadDto })
  async create(@Body() body: any): Promise<any> {
    return {
      data: await this.paymentService.createCheckoutInstant(body),
      message: 'Payment session created successfully',
    };
  }

  @Post('/create-charge')
  @ApiBody({ description: 'Create Charge Now', type: PaymentPayloadDto })
  async createCharge(@Body() body: any): Promise<any> {
    return {
      data: await this.paymentService.createCharge(body),
      message: 'Payment Done successfully',
    };
  }
}
