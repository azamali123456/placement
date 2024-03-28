import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { LoggerService } from '../../logger/logger.service';

@Controller('user')
@ApiTags('users')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('users controller');
  }
}
