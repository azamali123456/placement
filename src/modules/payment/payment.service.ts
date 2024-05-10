import { HttpException, Injectable } from '@nestjs/common';
import { responseSuccessMessage } from 'src/constants/responce';
import { ResponseCode } from 'src/exceptions';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JobService } from '../job/job.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  @InjectRepository(Payment)
  private readonly paymentRepository: Repository<Payment>;

  constructor(
    private readonly jobService: JobService,
    private readonly mailService: MailService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });
  }
  // Saved Payment Data
  async savedPayment(paymentDto: any): Promise<any> {
    try {
      const { name, email } = paymentDto.data.object.customer_details.name;
      await this.stripe.customers.create({
        name,
        email,
      });
      const jobsMetadata = JSON.parse(paymentDto.data.object.metadata.Jobs);
      for (let x = 0; x < jobsMetadata.length; x++) {
        const paymentObj = {
          varify: true,
          refunded: paymentDto.data.object.refunded,
          receipt_email: paymentDto.data.object.customer_details.email,
          payment_method_details: paymentDto.data.object.payment_method_details,
          payment_method: paymentDto.data.object.payment_method,
          payment_intent: paymentDto.data.object.payment_intent,
          paid: paymentDto.data.object.paid,
          invoice: paymentDto.data.object.invoice,
          customer: paymentDto.data.object.customer_details,
          currency: paymentDto.data.object.currency,
          created: paymentDto.data.object.created,
          billing_details: paymentDto.data.object.billing_details,
          balance_transaction: paymentDto.data.object.balance_transaction,
          amount_refunded: paymentDto.data.object.amount_refunded,
          amount_captured: paymentDto.data.object.amount_subtotal/100,
          amount: paymentDto.data.object.amount_total/100,
          object: paymentDto.data.object.object,
          metadata: jobsMetadata[x],
          jobId: Number(jobsMetadata[x]?.jobId),
          billingAddress: {
            firstName: jobsMetadata[x]?.firstName,
            lastName: jobsMetadata[x]?.lastName,
            // company: jobsMetadata[x]?.company,
            // address: jobsMetadata[x]?.address,
            // city: jobsMetadata[x]?.city,
            // state: jobsMetadata[x]?.state,
            // zipCode: jobsMetadata[x]?.zipCode,
          },
          billingMethod: {
            type: jobsMetadata[x]?.type,
            email: jobsMetadata[x]?.email,
          },
        };
        const statusUpdated :any = await this.jobService.updateJobStatus(Number(jobsMetadata[x]?.jobId) , {
          "status":"SUBMITTED"
        })
        // const stripe = require('stripe')('sk_test_51NFKZLAgDjJFNJDFCKn6K3RAcVhlQ4xnm6TaKI6ddKkHdfxT3928rcB8baVoB3XCFoscIrllGpeuPjRmwWAVt6qJ00vrjPBTnF');
        // const paymentIntentId = paymentDto.data?.object?.payment_intent
        const receiptUrl = '';
        // if (paymentIntentId) {
        //     const paymentIntent:any = await this.stripe.paymentIntents.retrieve(paymentIntentId);
        //     if (paymentIntent.status === 'succeeded') {
        //         // Check if the Payment Intent is successful
        //         if (paymentIntent.charges && paymentIntent.charges.data.length > 0) {
        //             // Check if charges exist
        //             receiptUrl = paymentIntent.charges.data[0].receipt_url || '';
        //         } else {
        //             console.log('No charges associated with the Payment Intent');
        //         }
        //     } else {
        //         console.log('Payment Intent is not successful');
        //     }
        // }

        // if (paymentIntentId) {
        //   const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        //    receiptUrl = paymentIntent.charges.data[0].receipt_url;

        // }
        // else if (invoiceId) {
        //   receiptUrl = `https://dashboard.stripe.com/invoices/${invoiceId}`;
        // }
        // if (jobsMetadata[0]?.accountHolder) {
        //   const mailSent = await this.mailService.sendNewMail(jobsMetadata[0]?.accountHolder, process.env.COMPANY_EMAIL, subject, mailHeading, mailBody, []);
        // }
        const date = new Date(paymentDto.created * 1000);
        `<html>
        <head>
          <style>
            /* Optional: Add styling for the image */
            .image-container {
              text-align: center;
            }
            .image-container img {
              max-width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body style="margin-left:35%;margin-right:35%;">
        <div style="
       padding: 15px;
       border:1px solid #808080;
       border-radius:5px;
       >
        <img width="60" height="60" src="https://staging3.placement-services.com/wp-content/uploads/2019/11/logo.png" alt="Stripe Receipt" />
          <div style="background-color: white; padding: 10px; color:#FF9900;">
            <h1>My Shop</h1>
            <p>TEST MODE</p>
          </div>
          <div class="invoice-container">
            <h2>Invoice <small>#${paymentDto.id}</small></h2>
            <p>Payment Date: ${date
              .toUTCString()
              .split(' ')
              .slice(0, 5)
              .join(' ')}</p>
            <p>Amount Paid: $${paymentDto.data.object.amount_total / 100}</p>
            <div>
            <a href="${receiptUrl}" target="_blank">View invoice and payment details ></a>
          </div> 
          </div>   
        </body>
      </html>`;

        // const mailSent = await this.mailService.sendNewMail(paymentObj.customer.email, process.env.COMPANY_EMAIL, subject, mailHeading, mailBody, []);
        const checkOut: any = await this.paymentRepository.create(paymentObj);
        await this.paymentRepository.save(checkOut);
      }

     
      return paymentDto;
    } catch (error: any) {
      throw new HttpException(error.message, ResponseCode.BAD_REQUEST);
    }
  }

  async createCheckoutInstant(object: any): Promise<any> {
    const lineItems = object.map((object) => ({
      price_data: {
        currency: object.currency || 'usd',
        product_data: {
          name: object.name,
          description: object.description.replace(/<\/?p>/g, '') || '',
        },
        unit_amount: parseInt(object.amount) * 100, // amount in cents
      },
      quantity: object.quantity || 1,
    }));
    const matadata = JSON.stringify(
      object.map((object) => ({
        jobId: `${object.jobId}`,
        userId: `${object.userId}`,
        email: `${object.billingMethod?.email}`,
        firstName: `${object.billingAddress?.firstName}`,
        lastName: `${object.billingAddress?.lastName}`,
        // company: `${object.billingAddress?.company}`,
        // address: `${object.billingAddress?.address}`,
        // city: `${object.billingAddress?.city}`,
        // state: `${object.billingAddress?.state}`,
        // zipCode: `${object.billingAddress?.zipCode}`,
        type: `${object.billingMethod.type}`,
        url: `${object?.success_url}`,
        accountHolder: `${object?.accountHolder}`,
      })),
    );
    const session = await this.stripe.checkout.sessions.create({
      line_items: lineItems,
      metadata: { Jobs: matadata },
      payment_method_types: ['card', 'us_bank_account'],
      mode: 'payment',
      success_url: `${object[0]?.success_url}`,
      cancel_url: `https://placement-services-venrup.web.app/checkout`,
    });
    return session;
  }

  // Setup Charge Now
  async createCharge(object: any): Promise<any> {
    try {
      const stripe = new Stripe(
        'sk_test_51NFKZLAgDjJFNJDFCKn6K3RAcVhlQ4xnm6TaKI6ddKkHdfxT3928rcB8baVoB3XCFoscIrllGpeuPjRmwWAVt6qJ00vrjPBTnF',
        { apiVersion: '2022-11-15' },
      );
      let amount: any = 0;
      let description: any = '';
      let token: any;
      let currency: any = '';
      for (let x = 0; x < object.length; x++) {
        amount = object[x].amount + amount;
        description = `${object[x].name}- ${description}`;
        token = object[x].token;
        currency = 'usd';
      }
      const charge: Stripe.Charge = await stripe.charges.create({
        amount,
        currency,
        description,
        source: token,
      });
      let email = '';
      for (let x = 0; x < object.length; x++) {
        const metadata = {
          url: object[x]?.success_url,
          city: object[x].billingAddress.city,
          type: object[x].billingMethod.type,
          email: object[x].billingMethod.email,
          jobId: object[x].jobId,
          state: object[x].billingAddress.state,
          userId: object[x].userId,
          address: '',
          company: object[x].billingAddress.company,
          zipCode: object[x].billingAddress.zipCode,
          lastName: object[x].billingAddress.lastName,
          firstName: object[x].billingAddress.firstName,
        };
        email = metadata.email;
        const paymentObj = {
          varify: true,
          refunded: charge.refunded,
          receipt_email: object[0].billingMethod.email,
          payment_method_details:
            typeof charge.payment_method_details == 'object'
              ? charge.payment_method_details
              : {},
          payment_method: charge.payment_method,
          payment_intent:
            typeof charge.payment_intent == 'string'
              ? charge.payment_intent
              : charge.payment_intent.id,
          paid: charge.paid,
          invoice:
            typeof charge.invoice == 'string'
              ? charge.invoice
              : charge.invoice.id,
          customer: typeof charge.customer == 'object' ? charge.customer : {},
          currency: charge.currency,
          created: charge.created,
          receipt_url: charge.receipt_url,
          billing_details: charge.billing_details,
          balance_transaction:
            typeof charge.balance_transaction == 'string'
              ? charge.balance_transaction
              : charge.balance_transaction.id,
          amount_refunded: charge.amount_refunded,
          amount_captured: charge.amount_captured,
          amount: charge.amount,
          object: charge.object,
          metadata: metadata,
          jobId: Number(metadata.jobId),
          billingAddress: {
            firstName: metadata?.firstName,
            lastName: metadata.lastName,
            company: metadata?.company,
            address: metadata?.address,
            city: metadata?.city,
            state: metadata?.state,
            zipCode: metadata?.zipCode,
          },
          billingMethod: {
            type: metadata?.type,
            email: metadata?.email,
          },
        };
        const checkOut: any = await this.paymentRepository.create(paymentObj);
        await this.paymentRepository.save(checkOut);
      }
      const date = new Date(charge.created * 1000);
      if (charge && charge.receipt_url) {
        const mailBody = `<html>
          <head>
            <style>
              /* Optional: Add styling for the image */
              .image-container {
                text-align: center;
              }
              .image-container img {
                max-width: 100%;
                height: auto;
              }
            </style>
          </head>
          <body style="margin-left:35%;margin-right:35%;">
          <div style="
         padding: 15px;
         border:1px solid #808080;
         border-radius:5px;
         >
          <img width="60" height="60" src="https://staging3.placement-services.com/wp-content/uploads/2019/11/logo.png" alt="Stripe Receipt" />
            <div style="background-color: white; padding: 10px; color:#FF9900;">
              <h1>My Shop</h1>
              <p>TEST MODE</p>
            </div>
            <div class="invoice-container">
              <h2>Invoice <small>#${charge.id}</small></h2>
              <p>Payment Date: ${date
                .toUTCString()
                .split(' ')
                .slice(0, 5)
                .join(' ')} </p>
              <p>Amount Paid: $${charge.amount / 100}</p>
              <div>
              <a href="${
                charge.receipt_url
              }" target="_blank">View invoice and payment details ></a>
            </div> 
            </div>   
          </body>
        </html>`;
        // Set the email subject and heading
        const mailHeading = `Placement Services USA, Inc.`;
        const subject = `Placement Services USA, Inc.`;
        // Send the email using the mailService.sendNewMail method
        // if(object[0].accountHolder){
        //   const mailSent = await this.mailService.sendNewMail(object[0].accountHolder, process.env.COMPANY_EMAIL, subject, mailHeading, mailBody, []);
        // }
        await this.mailService.sendNewMail(
          email,
          process.env.COMPANY_EMAIL,
          subject,
          mailHeading,
          mailBody,
          [],
        );
      }
      return responseSuccessMessage(
        'Checkout has been Done Successfully!',
        [],
        200,
      );
    } catch (err: any) {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    }
  }
}
