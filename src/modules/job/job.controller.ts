import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Patch,
  HttpException,
  Delete,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JobService } from '../job/job.service';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { Auth } from 'src/decorators';
import { Action } from 'src/casl/userRoles';
import { Job } from './job.entity';
import { JobStatus } from 'src/constants/module-contants';
import { StatusValidationPipe } from 'src/validations/status-validation.pipe';
import { ResponseCode } from 'src/exceptions';
@Controller('job')
@ApiTags('Job')
export class JobController {
  constructor(private readonly jobService: JobService) {}
  // Register Job
  @Auth(Action.Read, 'job')
  @Post('/add')
  @ApiBody({
    description:
      'Registered Your Job. <br/><strong>Note:</strong> If salary not mention then it will be 0 , status will be only one of these [SAVED,SUBMITTED,PUBLISHED]. jobDuration Must be 1 and not greater the 30 Days. ',
    type: Job,
  })
  async createJob(@Body() body: any, @AuthUser() userInfo: any) {
    body.userId = userInfo.id;
    const randomNum = Math.random() * 9000;
    body.jobNumber = Math.floor(1000 + randomNum);
    return this.jobService.createJob(body);
  }

  //My Job list
  @Get('/list')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Job, description: 'Job List' })
  async getJob() {
    // @AuthUser() userInfo: any
    return this.jobService.getJobsList();
  }

  //Get All Submitted Jobs list
  @Auth(Action.Update, 'update')
  @Get('/submitted/list')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Job, description: 'Submiited Jobs List' })
  async getSubmittedJobs(@AuthUser() userInfo: any) {
    if (userInfo.role === 'EMPLOYER') {
      throw new HttpException('Forbidden resource', ResponseCode.FORBIDDEN);
    }
    return this.jobService.GetMySubmittedJobs();
  }

  //Remove A Job
  @Delete('/reamove')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Job, description: 'Delete A Job' })
  async removeJob(@Query('id') id: number) {
    return this.jobService.deleteJob(id);
  }

  //Get Jobs List bY Status

  @Get('/list/status')
  @HttpCode(HttpStatus.OK)
  @Auth(Action.Read, 'User')
  @ApiQuery({ name: 'status', required: true })
  @ApiOkResponse({
    type: Job,
    description:
      'Get the My job list by Status [SAVED,SUBMITTED,PUBLISHED]. <br/><strong>Note:</strong> SAVED mean Darft not yet complete , SUBMITTED mean complete but not yet checkout, PUBLISHED mean completed and checkout',
  })
  async GetMyDraftJobs(
    @Query('status', StatusValidationPipe) status: JobStatus,
    @AuthUser() userInfo: any,
  ) {
    const userId = userInfo.id;
    return this.jobService.GetMySavedJobs(userId, status);
  }

  //Search For Jobs
  @Get('/search')
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'city', required: false })
  async saerchJob(
    @Query('keyword') keyword: string,
    @Query('city') city: string,
    @Query('state') state: string,
  ) {
    return this.jobService.SearchJob(keyword, city, state);
  }

  @Get('/search/submited')
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'city', required: false })
  async saerchSubmittedJob(
    @Query('keyword') keyword: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: string,
  ) {
    if (sortOrder == 'ascend') {
      sortOrder = 'ASC';
    } else {
      sortOrder = 'DESC';
    }

    return this.jobService.SearchSubmittedJob(
      keyword,
      startDate,
      endDate,
      sortBy,
      sortOrder,
    );
  }
  // Sorting and saerch Jobs List
  @Get('/sorted/list')
  @HttpCode(HttpStatus.OK)
  @Auth(Action.Read, 'User')
  @ApiOkResponse({ type: Job, description: 'Users list' })
  getSortedList(
    @AuthUser() user: any,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: string,
    @Query('keyword') keyword: string,
  ): any {
    if (sortOrder == 'ascend') {
      sortOrder = 'ASC';
    } else {
      sortOrder = 'DESC';
    }
    return this.jobService.getSortedList(sortBy, sortOrder, keyword);
  }
  // Job Varification
  @Patch('/varification')
  async jobVarification(@Query('id') id: number, @Body() body: any) {
    return this.jobService.JobVarifivcation(id, body);
  }

  // Find One Job
  @Get('/findone')
  async findOne(@Query('id') id: number) {
    return this.jobService.FindOne(id);
  }

  // Find And Update Job
  @Auth(Action.Read, 'User')
  @Patch('/update')
  @ApiOkResponse({ description: 'Update Job', type: Job })
  @ApiBody({ required: false, type: Job })
  @ApiQuery({ name: 'id', required: true })
  async update(
    @Query('id') id: number,
    @Body() body: any,
    @AuthUser() userInfo: any,
  ) {
    const userId = userInfo.id;
    if (body.status === JobStatus.SUBMITTED) {
      const randomNum = Math.random() * 9000;
      body.jobNumber = Math.floor(1000 + randomNum);
    }
    if (body.status === JobStatus.PUBLISHED) {
      body.varify = true;
    }
    return this.jobService.findOneAndUpdate(id, body, userId);
  }

  // Add To Cart Single Job
  @Auth(Action.Read, 'User')
  @Patch('/update/status')
  @ApiOkResponse({ description: 'Update Job Status', type: Job })
  async updateAddToCart(@Query('id') id: number, @Body() body: any) {
    return this.jobService.updateJobStatus(id, body);
  }

  // Add To Cart All Jobs
  @Auth(Action.Read, 'User')
  @Patch('/update/status/all')
  @ApiOkResponse({ description: 'Update Job Status', type: Job })
  async updateStatus(@Body() body: any) {
    return this.jobService.updateAllJobsStstus(body);
  }
}
