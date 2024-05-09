import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EmployerService } from '../employer/employer.service';
import { responseSuccessMessage } from '../../constants/responce';
import { Job } from '../job/job.entity';
import { Brackets, Like, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseCode } from 'src/exceptions';
import { excludingWords } from '../../constants/job-search';
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
          const endDate = await this.calculateEndDate(
            jobDto.startDate,
            jobDto.jobDuration,
          );
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
          await this.jobRepository.update(
            { id: data[x].id },
            { status: JobStatus.SUBMITTED },
          );
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
      const data = await this.jobRepository.delete({ id });
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
      const status = 'SUBMITTED';
      const data: any = await this.jobRepository
        .createQueryBuilder('job')
        .leftJoinAndSelect('job.employerInfo', 'employerInfo')
        .leftJoinAndSelect('job.payments', 'payment')
        .leftJoinAndSelect('job.user', 'user')
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
          'job.telecommuting',
          'job.varify',
          'job.educationAndExperience',
          'job.specialSkills',
          'job.travelRequirements',
          'job.remoteJob',
          'job.submitResume',
          'job.diaplayItem',
          'job.salary',
          'job.submittedDate',
          'job.jobDuration',
          'job.startDate',
          'job.endDate',
          //'job.requiredSkills',
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
          'user',
        ])
        .andWhere('job.status = :status', { status })
        .orderBy('job.submittedDate', 'DESC')
        .getMany();

      return responseSuccessMessage(`Your Submitted Jobs list`, data, 200);
    } catch (err) {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    }
  }

  // Get My Jobs List by Status (SAVED,SUBMITTED,PUBLISHED)
  async GetMySavedJobs(userId: any, status: any): Promise<any> {
    try {
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
          'job.storeDate',
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
          await this.jobRepository.update(
            { id: data[x].id },
            { status: JobStatus.SUBMITTED },
          );
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
      let newText: any = '';
      if (keyword) {
        newText = keyword
          .toLowerCase()
          .split(' ')
          .filter((word) => !excludingWords.includes(word))
          .join(' ');
      }
      console.log(newText, 'newText');
      let where1 = [];
      if (worksiteCity && keyword === undefined) {
        where1 = [
          {
            employerInfo: {
              worksiteCity: Like(`%${worksiteCity}%`),
              state: Like(`%${state}%`),
            },
            PSUSA_status: 'Enabled',
            endDate: MoreThan(new Date()),
          },
        ];
      } else if (newText && worksiteCity === undefined) {
        if (newText === '') {
          where1 = [];
        } else {
          where1 = [
            {
              jobTitle: Like(`%${newText}%`),
              PSUSA_status: 'Enabled',
              endDate: MoreThan(new Date()),
            },
            {
              requiredSkills: Like(`%${newText}%`),
              PSUSA_status: 'Enabled',
              endDate: MoreThan(new Date()),
            },
            {
              employerInfo: {
                companyName: Like(`%${newText}%`),
              },
              PSUSA_status: 'Enabled',
              endDate: MoreThan(new Date()),
            },
          ];
        }
      } else if ((newText || newText === '') && worksiteCity) {
        if (newText === '') {
          where1 = [];
        } else {
          where1 = [
            {
              jobTitle: Like(`%${newText}%`),
              PSUSA_status: 'Enabled',
              endDate: MoreThan(new Date()),
              employerInfo: {
                worksiteCity: Like(`%${worksiteCity}%`),
                state: Like(`%${state}%`),
              },
            },
            {
              requiredSkills: Like(`%${newText}%`),
              PSUSA_status: 'Enabled',
              endDate: MoreThan(new Date()),
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
              endDate: MoreThan(new Date()),
              PSUSA_status: 'Enabled',
            },
          ];
        }
      }
      if (where1.length === 0) {
        throw new HttpException('Invalid keyword', ResponseCode.BAD_REQUEST);
      }
      const result = await this.jobRepository.find({
        where: where1,
        relations: ['employerInfo'],
        select: [
          'id',
          'packagesId',
          'userId',
          "travelRequirements",
          // "companyNature",
          'telecommuting',
          'jobTitle',
          'multiPosition',
          'discription',
          'educationAndExperience',
          'specialSkills',
          'travelRequirements',
          'remoteJob',
          'varify',
          'jobNumber',
          'jobType',
          'resumeTo_PSUSA',
          'agentData',
          'specialInstructions',
          'submitResume',
          'storeDate',
          'diaplayItem',
          'PSUSA_status',
          'endDate',
          'salary',
          'jobDuration',
          'submitResume',
          "salary",
          // 'requiredSkills',
          "submitResume",
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
    sortBy: string,
    sortOrder: any,
  ): Promise<any> {
    try {
      const queryBuilder = this.jobRepository
        .createQueryBuilder('job')
        .where('job.status = :status', { status: JobStatus.SUBMITTED });
      if (startDate) {
        queryBuilder.andWhere('job.startDate >= :startDate', {
          startDate: new Date(startDate),
        });
      }

      if (endDate) {
        queryBuilder.andWhere('job.endDate <= :endDate', {
          endDate: new Date(endDate),
        });
      }

      if (keyword) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where('job.jobTitle LIKE :keyword', { keyword: `%${keyword}%` })
              .orWhere('job.jobNumber LIKE :keyword', {
                keyword: `%${keyword}%`,
              })
              .orWhere('employerInfo.companyName LIKE :keyword', {
                keyword: `%${keyword}%`,
              })
              .orWhere('user.firstName LIKE :keyword', {
                keyword: `%${keyword}%`,
              })
              .orWhere('user.lastName LIKE :keyword', {
                keyword: `%${keyword}%`,
              })
              .orWhere('employerInfo.hiringManager LIKE :keyword', {
                keyword: `%${keyword}%`,
              });
          }),
        );
      }
      if (sortBy == 'hiringManager') {
        sortBy = 'employerInfo.hiringManager';
      }
      if (sortBy == 'companyName') {
        sortBy = 'employerInfo.companyName';
      }
      const result = await queryBuilder
        .leftJoinAndSelect('job.employerInfo', 'employerInfo')
        .leftJoinAndSelect('job.payments', 'payments')
        .leftJoinAndSelect('job.user', 'user')
        .select([
          'job.id',
          'job.jobTitle',
          'job.jobNumber',
          'job.jobNumber',
          'job.multiPosition',
          'job.discription',
          'job.jobType',
          'job.startDate',
          'job.endDate',
          'job.educationAndExperience',
          // 'job.specialSkills',
          'job.travelRequirements',
          'job.remoteJob',
          'job.salary',
          'job.varify',
          'job.toApplyStatus',
          'job.toApplyText',
          'job.jobDuration',
          // 'job.requiredSkills',
          'job.status',
          'job.submitResume',
          'job.resumeTo_PSUSA',
          'job.storeDate',
          'job.submittedDate',
          'PSUSA_status',
          "job.remoteJob",
          "job.resumeTo_PSUSA",
          "job.specialInstructions",
          "job.specialSkills",
          "job.PSUSA_status",
          "job.status",
          "job.submitResume",
          "job.toApplyStatus",
          "job.toApplyText",
          "job.travelRequirements",
          "job.userId",
          "job.varify",
          "user",
          'employerInfo',
           'payments'])
        .orderBy(sortBy, sortOrder)
        .getMany()

      return result;
    } catch (err) {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    }
  }

  async getSortedList(
    sortBy: string,
    sortOrder: any,
    keyword: string,
  ): Promise<any> {
    try {
      let orderOptions: { [key: string]: 'ASC' | 'DESC' } = {};
      // Define the default sorting order for each field
      const defaultSortOrder: { [key: string]: 'ASC' | 'DESC' } = {
        startDate: 'ASC',
        endDate: 'ASC',
        storeDate: 'ASC',
        jobTitle: 'ASC',
        jobNumber: 'ASC',
        agent: 'ASC',
        hiringManager: 'ASC',
      };

      console.log(sortBy, 'sortBy', sortOrder);

      // Toggle sorting order if the same field is clicked again
      if (sortBy && sortOrder && defaultSortOrder[sortBy]) {
        if (sortBy === 'agent') {
          orderOptions['employerInfo.companyName'] = sortOrder;
        } else if (sortBy === 'hiringManager') {
          orderOptions['employerInfo.hiringManager'] = sortOrder;
        } else {
          orderOptions[sortBy] = sortOrder;
        }
      } else {
        // Use the default sorting order for the selected field
        orderOptions = { [sortBy]: defaultSortOrder[sortBy] };
      }
      // Define search criteria based on the keyword
      let searchCriteria = {};

      if (keyword) {
        searchCriteria = {
          where: [
            {
              jobTitle: Like(`%${keyword}%`),
              status: 'SUBMITTED', // Additional condition for status
            },
            {
              jobNumber: Like(`%${keyword}%`),
              status: 'SUBMITTED', // Additional condition for status
            },
            {
              employerInfo: {
                hiringManager: Like(`%${keyword}%`), // Search keyword in employerName field of employerInfo
              },
              status: 'SUBMITTED',
            },
            {
              employerInfo: {
                companyName: Like(`%${keyword}%`), // Search keyword in employerName field of employerInfo
              },
              status: 'SUBMITTED',
            },
          ],
        };
      } else {
        searchCriteria = {
          where: [
            {
              status: 'SUBMITTED', // Additional condition for status
            },
          ],
        };
      }

      // Fetch sorted jobs from the database based on the generated order options and search criteria
      const jobs: any[] = await this.jobRepository.find({
        ...searchCriteria,
        order: orderOptions,
        relations: ['employerInfo'],
      });
      // Remove sensitive information before sending the response
      return responseSuccessMessage('Sorted Jobs List!', jobs, 200);
    } catch (err) {
      console.log(err)
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    }
  }

  // Jobs Varification
  async JobVarifivcation(id: any, jobDto: any): Promise<any> {
    try {
      const job: any = await this.FindOne(Number(id));
      if (job.data.length === 0) {
        throw new HttpException('No Job found!', ResponseCode.BAD_REQUEST);
      } else {
        if (jobDto.employerInfo) {
          await this.employerService.updateEmployerInfo(
            job.data[0].employerInfo.id,
            jobDto.employerInfo,
          );
        }
        delete jobDto.employerInfo;
        await this.jobRepository.update({ id: id }, jobDto);

        const updatedJob: any = await this.FindOne(id);
        return responseSuccessMessage(
          'Job Varified Successful',
          updatedJob.data[0],
          200,
        );
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
      const result = await this.jobRepository.find({
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
          // 'requiredSkills',
          'status',
          'submitResume',
          'resumeTo_PSUSA',
          'PSUSA_status'
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
      const job: any = await this.FindOne(Number(id));
      if (job.data.length === 0) {
        throw new HttpException('No Job found!', ResponseCode.BAD_REQUEST);
      } else {
        if (userId === job.data[0].userId) {
          const employerInfo: any = jobDto.employerInfo;
          delete jobDto.employerInfo;
          // If startDate and jobDuration comes then both will updated if else....
          if (jobDto.jobDuration && jobDto.startDate) {
            const endDate = await this.calculateEndDate(
              jobDto.startDate,
              jobDto.jobDuration,
            );
            jobDto.endDate = endDate;
          } else if (jobDto.startDate) {
            const endDate = await this.calculateEndDate(
              jobDto.startDate,
              job.data[0].jobDuration,
            );
            jobDto.endDate = endDate;
          } else if (jobDto.jobDuration) {
            const endDate = await this.calculateEndDate(
              job.data[0].startDate,
              jobDto.jobDuration,
            );
            jobDto.endDate = endDate;
          }

          const updatedJob = await this.jobRepository.update(
            { id: id },
            jobDto,
          );
          // If You want to update EmployerInfo.
          if (updatedJob.affected > 0 && employerInfo) {
            await this.employerService.updateEmployerInfo(
              job.data[0].employerInfo.id,
              employerInfo,
            );
          }
        } else {
          throw new HttpException(
            `You have no access to edit this Job!`,
            ResponseCode.BAD_REQUEST,
          );
        }
        const updatedJob: any = await this.FindOne(id);
        return responseSuccessMessage(
          'Job Updated Successfully',
          updatedJob.data[0],
          200,
        );
      }
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  // Find And Update Job Status
  async updateJobStatus(id: number, jobDto: any): Promise<any> {
    try {
      // Find the job by its ID
      const job: any = await this.FindOne(Number(id));
      if (job && job.data) {
        const data = job.data[0];
        data.status = jobDto.status;
        await this.jobRepository.update({ id: Number(id) }, data);
        const updatedJob: any = await this.FindOne(Number(id));
        return responseSuccessMessage(
          'Job Updated Successfully',
          updatedJob.data,
          200,
        );
      } else {
        throw new HttpException('No Job Exist!', ResponseCode.NOT_FOUND);
      }
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  // Update All Jobs status
  async updateAllJobsStstus(jobList: any): Promise<any> {
    try {
      for (let x = 0; x < jobList.length; x++) {
        const job: any = await this.FindOne(Number(jobList[x].id));
        if (job && job.data) {
          const data = job.data[0];
          data.status = 'ADDTOCART';
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
