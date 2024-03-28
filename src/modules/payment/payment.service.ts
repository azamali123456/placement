import { HttpException, Injectable } from '@nestjs/common';
import { responseSuccessMessage } from 'src/constants/responce';
import { ResponseCode } from 'src/exceptions';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JobService } from '../job/job.service';
@Injectable()
export class PaymentService {
  private stripe: Stripe;
  @InjectRepository(Payment)
  private readonly paymentRepository: Repository<Payment>;
  constructor(private readonly jobService: JobService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });
  }
  // Saved Payment Data
  async savedPayment(paymentDto: any): Promise<any> {
    try {


      const { name, email } = paymentDto.data.object.customer_details.name;
      const stripeUser: any = await this.stripe.customers.create({
        name,
        email,
      });
      const jobsMetadata = JSON.parse(paymentDto.data.object.metadata.Jobs);
      // Saved the Payment Data
      for (let x = 0; x < jobsMetadata.length; x++) {
        const paymentObj = {
          varify: true,
          refunded: paymentDto.data.object.refunded,
          receipt_email: paymentDto.data.object.receipt_email,
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
          amount_captured: paymentDto.data.object.amount_captured,
          amount: paymentDto.data.object.amount,
          object: paymentDto.data.object.object,
          metadata: jobsMetadata[x],
          jobId: Number(jobsMetadata[x]?.jobId),
          billingAddress: {
            firstName: jobsMetadata[x]?.firstName,
            lastName: jobsMetadata[x]?.lastName,
            company: jobsMetadata[x]?.company,
            address: jobsMetadata[x]?.address,
            city: jobsMetadata[x]?.city,
            state: jobsMetadata[x]?.state,
            zipCode: jobsMetadata[x]?.zipCode,
          },
          billingMethod: {

            type: jobsMetadata[x]?.type,
            email: jobsMetadata[x]?.email,
          },
        };
        const checkOut: any = await this.paymentRepository.create(paymentObj);
        const checkOutSaved: any = await this.paymentRepository.save(checkOut);
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
          description: object.description || '',
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
        company: `${object.billingAddress?.company}`,
        address: `${object.billingAddress?.address}`,
        city: `${object.billingAddress?.city}`,
        state: `${object.billingAddress?.state}`,
        zipCode: `${object.billingAddress?.zipCode}`,
        type: `${object.billingMethod.type}`,
        url: `${object.success_url}`,
      })),
    );
    const session = await this.stripe.checkout.sessions.create({
      line_items: lineItems,
      metadata: { Jobs: matadata },
      payment_method_types: ['card', 'us_bank_account', 'cashapp'],
      mode: 'payment',
      success_url: `${object[0].success_url}`,
      cancel_url: `https://placement-services-venrup.web.app/checkout`,
    });

    return session;
  }

  // async createCheckoutInstant(object: any): Promise<any> {
  //   const session = await this.stripe.checkout.sessions.create({
  //     line_items: [
  //       {
  //         price_data: {
  //           currency: 'usd', // or your preferred currency
  //           product_data: {
  //             name: object.name,
  //             description: object.discription,
  //           },
  //           unit_amount: parseInt(object.amount) * 100, // amount in cents
  //         },
  //         quantity: object.quantity,

  //       },

  //     ],
  //     metadata: {
  //       jobId: `${object.jobId}`,
  //       userId: `${object.userId}`,
  //     },
  //     payment_method_types: ['card', 'us_bank_account', 'cashapp'],
  //     mode: 'payment',
  //     success_url: `http://localhost:3000`,
  //     cancel_url: `http://localhost:3000`,
  //   });
  //   return session;
  // }
}
