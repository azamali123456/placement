import {
  Controller,
  Post,
  Body,
  Get,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ServicsService } from './services.service';
import Stripe from 'stripe';
import { ServicesPayloadDto } from './dto/servicesDto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
@Controller('/servics')
@ApiTags('servics')
export class ServicsController {
  constructor(private readonly servicsService: ServicsService) {}
  // Create Servics Now
  @Post('/create')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    required: true,
    description: 'Note : pakages is array of instegers like [ id of pakages ].',
    type: ServicesPayloadDto,
  })
  async createServices(@Body() body: any) {
    return this.servicsService.savedServics(body);
  }
  // Get list of Servics
  @Get('/list')
  @HttpCode(HttpStatus.OK)
  //  @ApiBody({required: false, description: 'Get List ', type:ServicesPayloadDto })
  async getList(): Promise<Stripe.PaymentIntent> {
    return this.servicsService.getServicesList();
  }
}
