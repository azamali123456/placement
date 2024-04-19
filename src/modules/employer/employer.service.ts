import { HttpException, Injectable } from '@nestjs/common';
import {
  responseFailedMessage,
  responseSuccessMessage,
} from '../../constants/responce';
import { EmployerInfo } from '../employer/employer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseCode } from 'src/exceptions';

@Injectable()
export class EmployerService {
  constructor(
    @InjectRepository(EmployerInfo)
    private readonly EmployerRepository: Repository<EmployerInfo>,
  ) {}
  // Create new User
  async createEmployerInfo(employerDto: EmployerInfo): Promise<any> {
    try {
      const data: EmployerInfo = await this.EmployerRepository.create(
        employerDto,
      );
      const imployerInfo: EmployerInfo = await this.EmployerRepository.save(
        data,
      );
      return imployerInfo;
    } catch (err) {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    }
  }

  // Update a Job
  async updateEmployerInfo(id: any, updatedData: any): Promise<any> {
    try {
      const empoyerUpdate = await this.EmployerRepository.findOne({
        where: { id },
      });
      // If the job is not found, handle it accordingly
      if (!empoyerUpdate) {
        return responseFailedMessage('Employer-Info not found');
      }
      // Update the job with the new data
      const updatedJob = await this.EmployerRepository.save({
        ...empoyerUpdate,
        ...updatedData,
      });
      return responseSuccessMessage('Employer-Info updated!', updatedJob, 200);
    } catch (err) {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    }
  }
}
