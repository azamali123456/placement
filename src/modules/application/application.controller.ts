import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { JobApplicationService } from '../application/application.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { Application } from './application.entity';
@Controller('application')
@ApiTags('Job Application')
export class JapplicationController {
  constructor(private readonly jobApplicationService: JobApplicationService) {}
  // Register Application
  // @UseGuards(JwtGuard)
  @Post('/add')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({ description: 'Registered Job Application', type: Application })
  async createJob(@Body() body: any) {
    return this.jobApplicationService.createJobApplication(body);
  }
}
