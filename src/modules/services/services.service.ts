import { HttpException, Injectable } from '@nestjs/common';
import { responseSuccessMessage } from 'src/constants/responce';
import { ResponseCode } from 'src/exceptions';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { Services } from './services.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JobService } from '../job/job.service';
import { EmployerInfo } from '../employer/employer.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OnEvent } from '@nestjs/event-emitter';


@Injectable()
export class ServicsService {
  private stripe: Stripe;
  @InjectRepository(Services)
  private readonly servicsRepository: Repository<Services>;
  constructor() { }
  // Saved A Servics
  async savedServics(srvicsDto: any): Promise<any> {
    try {
      const servics: any = await this.servicsRepository.create(srvicsDto);
      const data: any = await this.servicsRepository.save(servics);
      return data;
    } catch (error: any) {
      throw new HttpException(error.message, ResponseCode.BAD_REQUEST);
    }
  }
  //Get Services List
  async getServicesList(): Promise<any> {
    try {
      const list: any[] = await this.servicsRepository.find();
      return list;
    } catch (error) {
      throw new HttpException(error.message, ResponseCode.BAD_REQUEST);
    }
  }
}


