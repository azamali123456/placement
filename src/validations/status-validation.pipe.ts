// status-validation.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { JobStatus } from 'src/constants/module-contants';

@Injectable()
export class StatusValidationPipe implements PipeTransform {
  transform(value: any) {
    if (!this.isStatusValid(value)) {
      throw new BadRequestException(
        'Invalid status value. Allowed values are: SAVED, SUBMITTED, PUBLISHED',
      );
    }
    return value;
  }

  private isStatusValid(value: any) {
    return Object.values(JobStatus).includes(value);
  }
}
