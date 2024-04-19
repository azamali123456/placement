import { HttpException, Injectable } from '@nestjs/common';
import { ResponseCode } from 'src/exceptions';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { Services } from './services.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ServicsService {
  private stripe: Stripe;
  @InjectRepository(Services)
  private readonly servicsRepository: Repository<Services>;
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
