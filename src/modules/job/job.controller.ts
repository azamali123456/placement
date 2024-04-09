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
  Delete
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
  constructor(private readonly jobService: JobService) { }
  // Register Job
  @Auth(Action.Read, 'job')
  @Post('/add')
  @ApiBody({ description: 'Registered Your Job. <br/><strong>Note:</strong> If salary not mention then it will be 0 , status will be only one of these [SAVED,SUBMITTED,PUBLISHED]. jobDuration Must be 1 and not greater the 30 Days. ', type: Job })
  async createJob(@Body() body: any, @AuthUser() userInfo: any) {
    body.userId = userInfo.id;
    if (body.status === JobStatus.SAVED) {
      // As Job status SAVED then Job Number will not be created!
      delete body.jobNumber
    }
    if (body.status === JobStatus.SUBMITTED) {
      // Note : Job Number will be created in SUBMITTED Jobs
      const randomNum = Math.random() * 9000
      body.jobNumber = Math.floor(1000 + randomNum)
    }
    if (body.status === JobStatus.PUBLISHED) {
      // As Job status PULISHED varify will be true!
      body.varify = true
    }
    return this.jobService.createJob(body);
  }

  //My Job list
  // @Auth(Action.Update,'EMPLOYER')
  @Get('/list')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Job, description: 'Job List', })
  async getJob(
    // @AuthUser() userInfo: any
  ) {
    return this.jobService.getJobsList();
  }

  //Get All Submitted Jobs list
  @Auth(Action.Update,'update')
  @Get('/submitted/list')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Job, description: 'Submiited Jobs List', })
  async getSubmittedJobs(@AuthUser() userInfo: any) {
     if(userInfo.role === 'EMPLOYER'){
      throw new HttpException("Forbidden resource", ResponseCode.FORBIDDEN);
     }
    return this.jobService.GetMySubmittedJobs();
  }

  //Remove A Job 
  @Delete('/reamove')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Job, description: 'Delete A Job', })
  async removeJob(@Query('id') id: number,) {
    return this.jobService.deleteJob(id);
  }

  //Get Add To Cart Jobs List 
  // @Get('/get-AddToCard-list')
  // @HttpCode(HttpStatus.OK)

  // @ApiOkResponse({ type: Job, description: 'Delete A Job', })
  // async getAddToCardList(@AuthUser() userInfo: any) {
  //   return this.jobService.getAddToCardList(userInfo.id);
  // }

  // Get My Jobs List by Status (SAVED,SUBMITTED,PUBLISHED )
  @Get('/list/status')
  @HttpCode(HttpStatus.OK)
  @Auth(Action.Read, 'User')
  @ApiQuery({ name: 'status', required: true })
  @ApiOkResponse({ type: Job, description: 'Get the My job list by Status [SAVED,SUBMITTED,PUBLISHED]. <br/><strong>Note:</strong> SAVED mean Darft not yet complete , SUBMITTED mean complete but not yet checkout, PUBLISHED mean completed and checkout', })
  async GetMyDraftJobs(@Query('status', StatusValidationPipe) status: JobStatus, @AuthUser() userInfo: any) {
    const userId = userInfo.id
    return this.jobService.GetMySavedJobs(userId, status);
  }

  //Search For Jobs
  @Get('/search')
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'city', required: false })
  async updateJob(
    @Query('keyword') keyword: string,
    @Query('city') city: string,
    @Query('state') state: string
  ) {
    return this.jobService.SearchJob(keyword, city, state);
  }

  // Search For Jobs
  @Get('/findone')
  async findOne(@Query('id') id: number) {
    return this.jobService.FindOne(id);
  }

  // Find And Update Jobs
  @Auth(Action.Read, 'User')
  @Patch('/update')
  @ApiOkResponse({ description: 'Update Job', type: Job, })
  @ApiBody({ required: false, type: Job })
  @ApiQuery({ name: 'id', required: true })
  async update(@Query('id') id: number, @Body() body: any, @AuthUser() userInfo: any) {
    const userId = userInfo.id

    if (body.status === JobStatus.SUBMITTED) {
      // Note : Job Number will be created in SUBMITTED Jobs
      const randomNum = Math.random() * 9000
      body.jobNumber = Math.floor(1000 + randomNum)
    }
    if (body.status === JobStatus.PUBLISHED) {
      // As Job status PULISHED varify will be true!
      body.varify = true
    }

    return this.jobService.findOneAndUpdate(id, body, userId);
  }




  // Add To Cart 
  @Auth(Action.Read, 'User')
  @Patch('/update/status')
  @ApiOkResponse({ description: 'Update Job Status', type: Job, })
  async updateAddToCart(@Query('id') id: number, @Body() body: any, @AuthUser() userInfo: any) {
    const userId = userInfo.id
    return this.jobService.updateJobStatus(id, body, userId);
  }


  @Auth(Action.Read, 'User')
  @Patch('/update/status/all')
  @ApiOkResponse({ description: 'Update Job Status', type: Job, })
  async updateStatus(@Body() body: any, @AuthUser() userInfo: any) {
    const userId = userInfo.id
    return this.jobService.updateAllJobsStstus(body, userId);
  }


  // Find And Update Jobs
  // @Auth(Action.Read, 'User')
  // @Get('/add-to-cart/list')
  // @ApiOkResponse({ description: 'Get Add To Cart Jobs List', type: Job, })
  // @ApiBody({ required: false, type: Job })
  // async getMyUncheckoutJobs( @Body() body: any, @AuthUser() userInfo: any) {  
  //   return this.jobService.GetMyUncheckoutJobs(userInfo.id);
  // }
}
