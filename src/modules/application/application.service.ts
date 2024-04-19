import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { responseSuccessMessage } from '../../constants/responce';
import { Application } from '../application/application.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ResponseCode } from 'src/exceptions';
import * as fs from 'fs';
import { MailService } from '../mail/mail.service';

@Injectable()
export class JobApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly jobRepository: Repository<Application>,
    private readonly mailServices: MailService,
  ) {}
  // Create new User
  async createJobApplication(jobApplicationDto: any): Promise<any> {
    try {
      if (
        jobApplicationDto.country === 'USA' ||
        jobApplicationDto.country === 'United States'
      ) {
        if (jobApplicationDto.city) {
          const job = await this.JobApplicationChild(jobApplicationDto);
          return responseSuccessMessage(
            'Job Application registered successfully',
            job,
            200,
          );
        } else {
          throw new HttpException(
            'If country is United States then city/state is required!',
            ResponseCode.BAD_REQUEST,
          );
        }
      } else {
        const job = await this.JobApplicationChild(jobApplicationDto);
        return responseSuccessMessage(
          'Job Application registered successfully',
          job,
          200,
        );
      }
    } catch (err) {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    }
  }
  async JobApplicationChild(jobApplicationDto: any): Promise<any> {
    const cvFile: any = jobApplicationDto.cv;
    const coverLaterFile: any = jobApplicationDto.coverLater;
    const userInstance = plainToClass(Application, jobApplicationDto);
    const validationErrors = await validate(userInstance);
    if (validationErrors.length > 0) {
      throw new BadRequestException(validationErrors[0]);
    } else {
      const bufferForCv = Buffer.from(jobApplicationDto.cv, 'base64');
      const cv = `assets/${Date.now()}.pdf`;
      fs.writeFile(cv, bufferForCv, (err) => {
        if (err) {
          console.error('Failed to write audio file:', err);
        } else {
          console.log('Audio file created:', cv);
        }
      });

      jobApplicationDto.cv = `${process.env.FILE_UPLOAD_PATH}${cv.replace(
        'assets',
        '',
      )}`;
      const attachments = [
        {
          filename: 'cv.pdf',
          content: cvFile,
          encoding: 'base64',
        },
      ];
      // If Cover later comes
      if (jobApplicationDto.coverLater) {
        const bufferForCoverLater = Buffer.from(
          jobApplicationDto.coverLater,
          'base64',
        );
        const coverLater = `assets/${Date.now()}.pdf`;
        fs.writeFile(coverLater, bufferForCoverLater, (err) => {
          if (err) {
            console.error('Failed to write audio file:', err);
          } else {
            console.log('Audio file created:', coverLater);
          }
        });
        jobApplicationDto.coverLater = `${
          process.env.FILE_UPLOAD_PATH
        }${coverLater.replace('assets', '')}`;
        attachments.push({
          filename: 'Cover-Later.pdf',
          content: coverLaterFile,
          encoding: 'base64',
        });
      }
      const data: any = await this.jobRepository.create(jobApplicationDto);
      const job: any = await this.jobRepository.save(data);
      const body = `<html>
       <body>
         <h2>Job Application Details</h2>
         <table style="border-collapse: collapse; width: 100%;">
           <tr>
             <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"><strong>Country</strong></td>
             <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${
               jobApplicationDto.country
             }</td>
           </tr>
           ${
             jobApplicationDto.country === 'USA' ||
             jobApplicationDto.country === 'United States'
               ? `<tr>
           <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"><strong>City/State</strong></td>
           <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${jobApplicationDto.city}</td>
         </tr>`
               : ``
           }
          
           <tr>
             <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"><strong>Education (Highest degree earned)</strong></td>
             <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${
               jobApplicationDto.education
             }</td>
           </tr>
           <tr>
             <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"><strong>Willing to relocate residence</strong></td>
             <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${
               jobApplicationDto.willingToRelocate === true ? 'Yes' : 'No'
             }</td>
           </tr>
           <tr>
             <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"><strong>Legally authorized to work in USA</strong></td>
             <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${
               jobApplicationDto.legallyFullTimeInUsa === true ? 'Yes' : 'No'
             }</td>
           </tr>
           <tr>
             <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"><strong>Eligible to work in USA</strong></td>
             <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${
               jobApplicationDto.eligibilityFullTimeInUsa
             }</td>
           </tr>
           <tr>
             <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"><strong>Name</strong></td>
             <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${
               jobApplicationDto.firstName
             }  ${jobApplicationDto.lastName}</td>
           </tr>
           <tr>
             <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"><strong>Phone</strong></td>
             <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${
               jobApplicationDto.phone
             }</td>
           </tr>
         </table>
       </body>
     </html>`;
      const heading = `Job Application Details for Placement Services USA, Inc.`;
      const subject = `Job # ${jobApplicationDto.jobNumber} Job title ${
        jobApplicationDto.jobTitle
      }  City, State ${
        jobApplicationDto.city
          ? jobApplicationDto.city
          : jobApplicationDto.country
      }`;
      await this.mailServices.sendNewMail(
        process.env.COMPANY_EMAIL,
        process.env.COMPANY_EMAIL,
        subject,
        heading,
        body,
        attachments,
      );
      return job;
    }
  }
}
