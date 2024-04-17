import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EmployerService } from '../employer/employer.service';
import { responseSuccessMessage } from '../../constants/responce';
import { Job } from '../job/job.entity';
import { LessThanOrEqual, Like, MoreThanOrEqual, Repository, getConnection, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseCode } from 'src/exceptions';
import { excludingWords } from "../../constants/job-search"
import { JobStatus } from 'src/constants/module-contants';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    private readonly employerService: EmployerService,
  ) { }
  // Create new User
  async createJob(jobDto: any): Promise<any> {
    try {
      if (jobDto.employerInfo) {
        const employer: any = await this.employerService.createEmployerInfo(
          jobDto.employerInfo,
        );
        jobDto.employerId = employer.id;
        delete jobDto.employerInfo;
        if (jobDto.jobDuration) {
          // const startDate = new Date();
          const endDate = await this.calculateEndDate(jobDto.startDate, jobDto.jobDuration);
          jobDto.endDate = endDate;
        }
        const data: any = await this.jobRepository.create(jobDto);
        const job: any = await this.jobRepository.save(data);
        return responseSuccessMessage('Job registered successfully', job, 200);
      }
    } catch (err) {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    }
  }

  // Job list
  async getJobsList(): Promise<any> {
    try {

      const data: any = await this.jobRepository
        .createQueryBuilder('job')
        .leftJoinAndSelect('job.employerInfo', 'employerInfo')
        .leftJoinAndSelect('job.payments', 'payment')
        .select([
          'job',
          'job.packagesId',
          'job.userId',
          'job.jobTitle',
          'job.multiPosition',
          'job.discription',
          'job.educationAndExperience',
          'job.specialSkills',
          'job.jobType',
          'job.travelRequirements',
          'job.remoteJob',
          'job.toApplyStatus',
          'job.varify',
          'job.toApplyText',
          'job.salary',
          'job.jobDuration',
          'job.startDate',
          'job.requiredSkills',
          'job.status',
          'job.specialInstructions',
          'job.recruitmentFirm',
          'job.referenceCode',
          'employerInfo.id',
          'employerInfo.companyName',
          'employerInfo.noOfEmployee',
          'employerInfo.hiringManager',
          'employerInfo.hiringManagerTitle',
          'employerInfo.companyNature',
          'employerInfo.worksiteStreet',
          'employerInfo.worksiteCity',
          'employerInfo.worksiteZipCode',
          'payment',
        ])
        // .where('job.userId = :userId', { userId })
        .getMany();

      for (let x = 0; x < data.length; x++) {
        if (data[x].payments.length > 0 && data[x].status === 'SAVED') {
          const updatedJob = await this.jobRepository.update({ id: data[x].id }, { status: JobStatus.SUBMITTED });
          data[x].status = JobStatus.SUBMITTED;
        }
      }
      return responseSuccessMessage('Job list', data, 200);
    } catch (err) {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    }
  }



  // Delete A Job
  async deleteJob(id: any): Promise<any> {
    try {
      const data = await this.jobRepository.delete({ id })
      if (data.affected === 0) {
        throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
      }
      return responseSuccessMessage('Job Deleted Successfully!', data, 200);
    } catch (err) {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    }
  }

  // Delete A Job
  // async getAddToCardList(userId: any): Promise<any> {
  //   try {
  //     const addToCard = true;
  //     const data: any = await this.jobRepository
  //       .createQueryBuilder('job')
  //       .leftJoinAndSelect('job.employerInfo', 'employerInfo')
  //       .leftJoinAndSelect('job.payments', 'payment')
  //       .select([
  //         'job',
  //         'job.packagesId',
  //         'job.userId',
  //         'job.jobTitle',
  //         'job.multiPosition',
  //         'job.discription',
  //         'job.educationAndExperience',
  //         'job.specialSkills',
  //         'job.jobType',
  //         'job.travelRequirements',
  //         'job.remoteJob',
  //         'job.toApplyStatus',
  //         'job.varify',
  //         'job.toApplyText',
  //         'job.salary',
  //         'job.jobDuration',
  //         'job.startDate',
  //         'job.requiredSkills',
  //         'job.status',
  //         'job.specialInstructions',
  //         'job.recruitmentFirm',
  //         'job.referenceCode',
  //         'employerInfo.id',
  //         'employerInfo.companyName',
  //         'employerInfo.noOfEmployee',
  //         'employerInfo.hiringManager',
  //         'employerInfo.hiringManagerTitle',
  //         'employerInfo.companyNature',
  //         'employerInfo.worksiteStreet',
  //         'employerInfo.worksiteCity',
  //         'employerInfo.worksiteZipCode',
  //         'payment',
  //       ])
  //       .where('job.userId = :userId', { userId })
  //       .andWhere('job.addToCard = :addToCard', { addToCard })
  //       .getMany();
  //     return responseSuccessMessage('Add-To-Cart Jobs list', data, 200);
  //   } catch (err) {
  //     throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
  //   }
  // }


  // Get My submitted Jobs list
  async GetMySubmittedJobs(): Promise<any> {
    try {
      const status = 'SUBMITTED'
      const data: any = await this.jobRepository
        .createQueryBuilder('job')
        .leftJoinAndSelect('job.employerInfo', 'employerInfo')
        .leftJoinAndSelect('job.payments', 'payment')
        .leftJoinAndSelect('job.packages', 'packages')
        .select([
          'job.id',
          'job.packagesId',
          'job.userId',
          'job.jobTitle',
          'job.multiPosition',
          'job.discription',
          'job.jobType',
          'job.jobNumber',
          'job.toApplyStatus',
          'job.toApplyText',
          'job.varify',
          'job.educationAndExperience',
          'job.specialSkills',
          'job.travelRequirements',
          'job.remoteJob',
          'job.salary',
          'job.submittedDate',
          'job.jobDuration',
          'job.startDate',
          'job.endDate',
          'job.requiredSkills',
          'job.status',
          'job.specialInstructions',
          'job.recruitmentFirm',
          'job.referenceCode',
          'employerInfo.id',
          'employerInfo.companyName',
          'employerInfo.noOfEmployee',
          'employerInfo.hiringManager',
          'employerInfo.hiringManagerTitle',
          'employerInfo.companyNature',
          'employerInfo.worksiteStreet',
          'employerInfo.worksiteCity',
          'employerInfo.worksiteZipCode',
          'employerInfo.state',
          'job.agentData',
          'job.invoiceCopyTo',
          'job.PSUSA_status',
          'job.resumeTo_PSUSA',
          'job.storeDate',
          'payment',
          'packages',
        ])
        .andWhere('job.status = :status', { status })
        .orderBy('job.startDate', 'DESC')
        .getMany();
      return responseSuccessMessage(`Your Submitted Jobs list`, data, 200);
    } catch (err) {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    }
  }

  // Get My Jobs List by Status (SAVED,SUBMITTED,PUBLISHED)
  async GetMySavedJobs(userId: any, status: any): Promise<any> {
    try {
      const addToCard = false
      const data: any = await this.jobRepository
        .createQueryBuilder('job')
        .leftJoinAndSelect('job.employerInfo', 'employerInfo')
        .leftJoinAndSelect('job.payments', 'payment')
        .leftJoinAndSelect('job.packages', 'packages')
        .select([
          'job.id',
          'job.packagesId',
          'job.userId',
          'job.jobTitle',
          'job.multiPosition',
          'job.discription',
          'job.jobType',
          'job.toApplyStatus',
          'job.toApplyText',
          'job.varify',
          'job.educationAndExperience',
          'job.specialSkills',
          'job.travelRequirements',
          'job.remoteJob',
          'job.salary',
          'job.submittedDate',
          'job.jobDuration',
          'job.startDate',
          'job.endDate',
          'job.requiredSkills',
          'job.status',
          'job.specialInstructions',
          'job.recruitmentFirm',
          'job.referenceCode',
          'employerInfo.id',
          'employerInfo.companyName',
          'employerInfo.noOfEmployee',
          'employerInfo.hiringManager',
          'employerInfo.hiringManagerTitle',
          'employerInfo.companyNature',
          'employerInfo.worksiteStreet',
          'employerInfo.worksiteCity',
          'employerInfo.worksiteZipCode',
          'employerInfo.state',
          'payment',
          'packages',
        ])
        .andWhere('job.userId = :userId', { userId })
        .andWhere('job.status = :status', { status })
        .orderBy('job.id', 'DESC')
        .getMany();

      for (let x = 0; x < data.length; x++) {
        if (data[x].payments.length > 0 && data[x].status === 'ADDTOCART') {
          const updatedJob = await this.jobRepository.update({ id: data[x].id }, { status: JobStatus.SUBMITTED });
          data[x].status = JobStatus.SUBMITTED;
        }
      }
      return responseSuccessMessage(`Your ${status} Jobs list`, data, 200);
    } catch (err) {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    }
  }
  // Search a Job
  async SearchJob(
    keyword: string,
    worksiteCity: string,
    state: string,
  ): Promise<any> {
    if (
      (!keyword && !worksiteCity) ||
      keyword?.length < 2 ||
      worksiteCity?.length < 2
    ) {
      throw new HttpException('malicious search', ResponseCode.BAD_REQUEST);
    }
    try {
      let newText: any = ''
      if (keyword) {
        newText = keyword.toLowerCase().split(' ').filter(word => !excludingWords.includes(word)).join(' ');
      }
      let where1 = [];
      if (worksiteCity && keyword === undefined) {
        where1 = [
          {
            employerInfo: {
              worksiteCity: Like(`%${worksiteCity}%`),
              state: Like(`%${state}%`),
            },
          },
        ];
      }
      else if (newText && worksiteCity === undefined) {
        if (newText === '') {
          where1 = []
        } else {
          where1 = [
            {
              jobTitle: Like(`%${newText}%`), status: JobStatus.SUBMITTED,
            },
            {
              requiredSkills: Like(`%${newText}%`), status: JobStatus.SUBMITTED
            },
            {
              employerInfo: {
                companyName: Like(`%${newText}%`)
              },
            },
          ];
        }
      }
      else if ((newText || newText === '') && worksiteCity) {
        if (newText === '') {
          where1 = [];
        } else {
          where1 = [
            {
              jobTitle: Like(`%${newText}%`), status: JobStatus.SUBMITTED,
              employerInfo: {
                worksiteCity: Like(`%${worksiteCity}%`),
                state: Like(`%${state}%`),
              },
            },
            {
              requiredSkills: Like(`%${newText}%`), status: JobStatus.SUBMITTED,
              employerInfo: {
                worksiteCity: Like(`%${worksiteCity}%`),
                state: Like(`%${state}%`),
              },
            },
            {
              employerInfo: {
                companyName: Like(`%${newText}%`),
                worksiteCity: Like(`%${worksiteCity}%`),
                state: Like(`%${state}%`),
              },
            },
          ];
        }
      }
      if (where1.length === 0) {
        throw new HttpException('Invalid keyword', ResponseCode.BAD_REQUEST);
      }

      let result = await this.jobRepository.find({
        where: where1,
        relations: ['employerInfo'],
        select: [
          'id',
          'packagesId',
          'userId',
          'jobTitle',
          'multiPosition',
          'discription',
          'educationAndExperience',
          'specialSkills',
          'travelRequirements',
          'remoteJob',
          'varify',
          'jobType',
          'salary',
          'jobDuration',
          'requiredSkills',
          'status',
        ],
      });
      return result;
    } catch (err) {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    }
  }



  // Search submitted Jobs
  async SearchSubmittedJob(
    keyword: string,
    startDate: string,
    endDate: string,
  ): Promise<any> {
    if (!keyword && !startDate && !endDate) {
      throw new HttpException('Either keyword or date range must be provided', ResponseCode.BAD_REQUEST);
    }

    try {
      let where1: any[] = [];

      if (keyword) {
        where1.push(
          {
            jobTitle: Like(`%${keyword}%`),
            status: JobStatus.SUBMITTED,
          },
          {
            discription: Like(`%${keyword}%`),
            status: JobStatus.SUBMITTED,
          },
          {
            jobNumber: Like(`%${keyword}%`),
            status: JobStatus.SUBMITTED,
          }
        );
      }



      if (startDate && endDate) {
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        endDateObj.setHours(23, 59, 59, 999); // Set end of day for endDate
        where1.push({
          startDate: MoreThanOrEqual(startDateObj),
          endDate: LessThanOrEqual(endDateObj),
        });
      }
      if (!startDate && endDate) {
        const endDateObj = new Date(endDate);
        endDateObj.setHours(23, 59, 59, 999); // Set end of day for endDate
        where1.push({
          endDate: LessThanOrEqual(endDateObj),
        });
      }
      if (startDate && !endDate) {
        const startDateObj = new Date(startDate);
        where1.push({
          startDate: MoreThanOrEqual(startDateObj),
        });
      }

      // Handle the case where both startDate and endDate are provided


      if (where1.length === 0) {
        throw new HttpException('Invalid keyword or date range', ResponseCode.BAD_REQUEST);
      }

      let result = await this.jobRepository.find({
        where: where1,
        relations: ['employerInfo', 'payments'],
        // .leftJoinAndSelect('job.employerInfo', 'employerInfo')
        // .leftJoinAndSelect('job.payments', 'payment')
        select: [
          'id',
          'packagesId',
          'jobNumber',
          'endDate',
          'startDate',
          'userId',
          'jobTitle',
          'multiPosition',
          'discription',
          'educationAndExperience',
          'specialSkills',
          'travelRequirements',
          'remoteJob',
          'varify',
          'jobType',
          'salary',
          'jobDuration',
          'requiredSkills',
          'status',
        ],
      });

      return result;
    } catch (err) {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    }
  }


  // Jobs Varification
  async JobVarifivcation(id: any, jobDto: any): Promise<any> {
    try {
      let job: any = await this.FindOne(Number(id))
      if (job.data.length === 0) {
        throw new HttpException('No Job found!', ResponseCode.BAD_REQUEST);
      } else {
        const Job = await this.jobRepository.update({ id: id }, jobDto)
        let updatedJob: any = await this.FindOne(id)
        return responseSuccessMessage('Job Varified Successfull', updatedJob.data[0], 200);
      }
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }


  // Find A Job
  async FindOne(id: number): Promise<any> {
    try {
      const where = [
        {
          id: id,
        },
      ];
      let result = await this.jobRepository.find({
        where: where,
        relations: ['employerInfo'],
        select: [
          'id',
          'packagesId',
          'userId',
          'jobNumber',
          'jobTitle',
          'multiPosition',
          'discription',
          'jobType',
          'startDate',
          'educationAndExperience',
          'specialSkills',
          'travelRequirements',
          'remoteJob',
          // 'addToCard',
          'salary',
          'varify',
          'toApplyStatus',
          'toApplyText',
          'jobDuration',
          'requiredSkills',
          'status',
        ],
      });
      if (result.length === 0) {
        throw new HttpException('No Job Found', ResponseCode.NOT_FOUND);
      }
      return responseSuccessMessage('Find A Job', result, 200);
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
  // Find And Update
  async findOneAndUpdate(id: number, jobDto: any, userId: any): Promise<any> {
    try {
      let job: any = await this.FindOne(Number(id))
      if (job.data.length === 0) {
        throw new HttpException('No Job found!', ResponseCode.BAD_REQUEST);
      } else {
        if (userId === job.data[0].userId) {
          const employerInfo: any = jobDto.employerInfo
          delete jobDto.employerInfo
          // If startDate and jobDuration comes then both will updated if else....
          if (jobDto.jobDuration && jobDto.startDate) {
            const endDate = await this.calculateEndDate(jobDto.startDate, jobDto.jobDuration);
            jobDto.endDate = endDate;
          } else if (jobDto.startDate) {
            const endDate = await this.calculateEndDate(jobDto.startDate, job.data[0].jobDuration);
            jobDto.endDate = endDate;
          } else if (jobDto.jobDuration) {
            const endDate = await this.calculateEndDate(job.data[0].startDate, jobDto.jobDuration);
            jobDto.endDate = endDate;
          }

          const updatedJob = await this.jobRepository.update({ id: id }, jobDto)
          // If You want to update EmployerInfo.
          if (updatedJob.affected > 0 && employerInfo) {
            const updatedEmployer = await this.employerService.updateEmployerInfo(job.data[0].employerInfo.id, employerInfo)
          }
        } else {
          throw new HttpException(`You have no access to edit this Job!`, ResponseCode.BAD_REQUEST);
        }
        let updatedJob: any = await this.FindOne(id)
        return responseSuccessMessage('Job Updated Successfully', updatedJob.data[0], 200);
      }
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }



  // Find And Update Job Status
  async updateJobStatus(id: number, jobDto: any, userId: any): Promise<any> {
    try {
      // Find the job by its ID
      const job: any = await this.FindOne(Number(id));
      if (job && job.data) {
        const data = job.data[0];
        data.status = jobDto.status
        await this.jobRepository.update({ id: Number(id) }, data);
        const updatedJob: any = await this.FindOne(Number(id));
        return responseSuccessMessage('Job Updated Successfully', updatedJob.data, 200);
      } else {
        throw new HttpException('No Job Exist!', ResponseCode.NOT_FOUND);
      }
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }



  // Update All Jobs status 
  async updateAllJobsStstus(jobList: any, userId: any): Promise<any> {
    try {
      for (let x = 0; x < jobList.length; x++) {
        const job: any = await this.FindOne(Number(jobList[x].id));
        if (job && job.data) {
          const data = job.data[0];
          data.status = 'ADDTOCART'
          await this.jobRepository.update({ id: Number(jobList[x].id) }, data);
        } else {
          throw new HttpException('No Job Exist!', ResponseCode.NOT_FOUND);
        }
      }
      return responseSuccessMessage('Jobs are Added to Cart', [], 200);

    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }


  // Find And Update
  // async GetMyUncheckoutJobs(userId: any): Promise<any> {
  //   try {
  //     const status = 'SAVED';
  //     const addToCard = true;
  //     const data: any = await this.jobRepository
  //       .createQueryBuilder('job')
  //       .leftJoinAndSelect('job.payments', 'payment')
  //       .leftJoinAndSelect('job.employerInfo', 'employerInfo')
  //       .leftJoinAndSelect('job.packages', 'packages')
  //       .select([
  //         'job.id',
  //         'job.packagesId',
  //         'job.userId',
  //         'job.jobTitle',
  //         'job.multiPosition',
  //         'job.discription',
  //         'job.jobType',
  //         'job.toApplyStatus',
  //         'job.toApplyText',
  //         'job.varify',
  //         'job.educationAndExperience',
  //         'job.specialSkills',
  //         'job.travelRequirements',
  //         'job.remoteJob',
  //         'job.salary',
  //         'job.jobNumber',
  //         'job.submittedDate',
  //         'job.jobDuration',
  //         'job.startDate',
  //         'job.endDate',
  //         'job.requiredSkills',
  //         'job.status',
  //         'job.specialInstructions',
  //         'job.recruitmentFirm',
  //         'job.referenceCode',
  //         'employerInfo.companyName',
  //         'employerInfo.noOfEmployee',
  //         'employerInfo.hiringManager',
  //         'employerInfo.hiringManagerTitle',
  //         'employerInfo.companyNature',
  //         'employerInfo.worksiteStreet',
  //         'employerInfo.worksiteCity',
  //         'employerInfo.worksiteZipCode',
  //         'packages.title',
  //         'packages.price',
  //         'packages.discription',
  //         'payment',
  //       ])
  //       .andWhere('job.userId = :userId', { userId })
  //       .andWhere('job.status = :status', { status })
  //       .andWhere('job.addToCard = :addToCard', { addToCard })
  //       .orderBy('job.id', 'DESC')
  //       .getMany();
  //     const unCheckout = []
  //     for (let x = 0; x < data.length; x++) {
  //       if (data[x].payments.length === 0) {
  //         unCheckout.push(data[x])
  //       }
  //     }
  //     return responseSuccessMessage(`Your SUBMITTED Jobs list`, unCheckout, 200);

  //   } catch (err) {
  //     throw new HttpException(err.message, err.status);
  //   }
  // }



  // Calculate End Date
  async calculateEndDate(startDate: any, jobDuration: number): Promise<Date> {
    const start = new Date(startDate);
    const end = new Date(startDate);
    end.setDate(start.getDate() + jobDuration - 1); // Subtract 1 to get the correct end date
    return end;
  }
}
