import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { EmployerService } from '../employer/employer.service';
import { Auth, AuthUser } from 'src/decorators';
import { Action } from '../../casl/userRoles';
import { EmployerInfo } from './employer.entity';
import { User } from '../user/user.entity';
@Controller('employer')
@ApiTags('Employer')
export class EmployerController {
  constructor(private readonly jobService: EmployerService) {}
  // Register Job
  @Post('/add')
  @Auth(Action.Read, 'employee')
  @ApiBody({ description: 'Registered Job', type: EmployerInfo })
  async createEmployeer(@Body() body: EmployerInfo, @AuthUser() user: User) {
    //body.userId = user.id;
    return this.jobService.createEmployerInfo(body);
  }
}
