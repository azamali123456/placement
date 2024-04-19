import {
  Controller,
  Post,
  Body,
  Get,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ServicsService } from './pakages.service';
import Stripe from 'stripe';
import { PakagesPayloadDto } from './dto/pakagesDto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
@Controller('/pakages')
@ApiTags('pakages')
export class PakagesController {
  constructor(private readonly servicsService: ServicsService) {}
  // Create Pakages Now
  @Post('/create')
  @ApiBody({ description: 'Create Job Pakages', type: PakagesPayloadDto })
  async createme(@Body() body: any) {
    return this.servicsService.savedPakages(body);
  }
  // Get list of pakages
  @Get('/list')
  @HttpCode(HttpStatus.OK)
  // @ApiBody({ description: 'Get Pakages List ', type:PakagesPayloadDto })
  async create(): Promise<Stripe.PaymentIntent> {
    return this.servicsService.getPakagesList();
  }
}
