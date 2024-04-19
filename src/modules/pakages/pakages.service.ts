import { HttpException, Injectable } from '@nestjs/common';
import { ResponseCode } from 'src/exceptions';
import { Repository } from 'typeorm';
import { Pakages } from './pakages.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ServicsService {
  @InjectRepository(Pakages)
  private readonly pakagesRepository: Repository<Pakages>;
  // Saved A Pakage
  async savedPakages(srvicsDto: any): Promise<any> {
    try {
      const pakages: any = await this.pakagesRepository.create(srvicsDto);
      const data: any = await this.pakagesRepository.save(pakages);
      return data;
    } catch (error: any) {
      throw new HttpException(error.message, ResponseCode.BAD_REQUEST);
    }
  }
  //Get Pakages List
  async getPakagesList(): Promise<any> {
    try {
      const list: any[] = await this.pakagesRepository.find();
      return list;
    } catch (error) {
      throw new HttpException(error.message, ResponseCode.BAD_REQUEST);
    }
  }
}
