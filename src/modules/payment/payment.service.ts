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

  // Setup Charge Now
  async createCharge(object: any): Promise<any> {
    try {
      const stripe = require('stripe')('sk_test_51NFKZLAgDjJFNJDFCKn6K3RAcVhlQ4xnm6TaKI6ddKkHdfxT3928rcB8baVoB3XCFoscIrllGpeuPjRmwWAVt6qJ00vrjPBTnF');
      let amount: any = 0
      let description: any = ''
      let token: any
      let currency: any = ''
      for (let x = 0; x < object.length; x++) {
        amount = object[x].amount + amount
        description = `${object[x].name}- ${description}`
        token = object[x].token
        currency = 'usd'
      }
      const charge = await stripe.charges.create({
        amount,
        currency,
        description,
        source: token,
      });


      // const { name, email } = charge.data.object.customer_details.name;
      // const stripeUser: any = await this.stripe.customers.create({
      //   name,
      //   email,
      // });
      // const jobsMetadata = JSON.parse(charge.data.object.metadata.Jobs);
      // Saved the Payment Data
      for (let x = 0; x < object.length; x++) {
        const metadata = { url: object[x].success_url, city: object[x].billingAddress.city, type: object[x].billingMethod.type, email: object[x].billingMethod.email, jobId: object[x].jobId, state: object[x].billingAddress.state, userId: object[x].userId, address: "", company: object[x].billingAddress.company, zipCode: object[x].billingAddress.zipCode, lastName: object[x].billingAddress.lastName, firstName: object[x].billingAddress.firstName }
        const paymentObj = {
          varify: true,
          refunded: charge.refunded,
          receipt_email: object[0].billingMethod.email,
          payment_method_details: charge.payment_method_details,
          payment_method: charge.payment_method,
          payment_intent: charge.payment_intent,
          paid: charge.paid,
          invoice: charge.invoice,
          customer: charge.customer,
          currency: charge.currency,
          created: charge.created,
          receipt_url: charge.receipt_url,
          billing_details: charge.billing_details,
          balance_transaction: charge.balance_transaction,
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
        const checkOutSaved: any = await this.paymentRepository.save(checkOut);
      }
      return responseSuccessMessage('Checkout has been Done Successfully!', [], 200);
    } catch (err: any) {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    }
  }

}
