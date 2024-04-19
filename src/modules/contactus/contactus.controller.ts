import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ContactUsService } from './contactus.service';
import { Contactus } from './contactus.entity';
@Controller('contactus')
@ApiTags('Contact Us')
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}
  // Contact Us
  @Post('/')
  @ApiBody({ description: 'Contact Us', type: Contactus })
  async createJob(@Body() body: any) {
    return this.contactUsService.contactUs(body);
  }
}
