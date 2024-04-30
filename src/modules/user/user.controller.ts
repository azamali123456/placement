import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { LoggerService } from '../../logger/logger.service';
import { Auth, AuthUser } from 'src/decorators';
import { Action } from 'src/casl/userRoles';
import { User } from './user.entity';
import { ResponseCode } from 'src/exceptions';

@Controller('user')
@ApiTags('users')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('users controller');
  }
  // Get Users List
  @Get('/list')
  @HttpCode(HttpStatus.OK)
  @Auth(Action.Read, 'User')
  @ApiOkResponse({ type: User, description: 'Users list' })
  getCurrentUser(@AuthUser() user: any): any {
    if (user.role === 'EMPLOYER') {
      throw new HttpException('Forbidden resource', ResponseCode.FORBIDDEN);
    }
    return this.userService.getList();
  }

  // Sort Now
  @Get('/sorted/list')
  @HttpCode(HttpStatus.OK)
  @Auth(Action.Read, 'User')
  @ApiOkResponse({ type: User, description: 'Users list' })
  getSortedList(
    @AuthUser() user: any,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: string,
    @Query('keyword') keyword: string,
  ): any {
    if (user.role === 'EMPLOYER') {
      throw new HttpException('Forbidden resource', ResponseCode.FORBIDDEN);
    } else {
      if (sortOrder == 'ascend') {
        sortOrder = 'ASC';
      } else {
        sortOrder = 'DESC';
      }
      return this.userService.getSortedList(sortBy, sortOrder, keyword);
    }
  }

  // Sort Now
  @Get('/search/list')
  @HttpCode(HttpStatus.OK)
  @Auth(Action.Read, 'User')
  @ApiOkResponse({ type: User, description: 'Users list' })
  getSearchList(@AuthUser() user: any, @Query('keyword') keyword: string): any {
    if (user.role === 'EMPLOYER') {
      throw new HttpException('Forbidden resource', ResponseCode.FORBIDDEN);
    }
    return this.userService.getSearchList(keyword);
  }
}
