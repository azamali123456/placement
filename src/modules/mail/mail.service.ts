import * as SendGrid from '@sendgrid/mail';
import { Injectable } from '@nestjs/common';
import { Client } from '@sendgrid/client';
import { ClientRequest } from '@sendgrid/client/src/request';
@Injectable()
export class MailService {
  constructor() {
    SendGrid.setApiKey(process.env.API_KEY);
  }

  private async verifySenderIdentity(): Promise<void> {
    const sendgridClient = new Client();
    sendgridClient.setApiKey(process.env.API_KEY);
    const data = {
      nickname: 'nick',
      from_email: 'aaza7246@gmail.com',
      from_name: 'Example Orders',
      address: '123 Main St',
      reply_to: 'aaza7246@gmail.com',
      city: 'San Francisco',
      country: 'USA',
    };
    const request: ClientRequest = {
      url: `/v3/verified_senders`,
      method: 'post',
      body: data,
    };

    sendgridClient
      .request(request)
      .then(([response]) => {
        console.log(response.statusCode);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async sendNewMail(
    to: any,
    from: any,
    subject: any,
    heading: any,
    body: any,
    attachments: any,
  ): Promise<any> {
    try {
      // First Varify Your Mail
      // const varify = await this.verifySenderIdentity(from);
      const mailConfig = {
        to: to,
        subject: subject,
        from: from,
        // replyTo: 'development@venrup.com',
        text: heading,
        html: body,
        attachments: attachments,
      };
      const transport = await SendGrid.send(mailConfig);
      return transport; // Email sent successfully
    } catch (error) {
      console.error('Error sending email:', error);
      return error; // Failed to send email
    }
  }
}
