import { Module } from '@nestjs/common';
import { QuickBooksService } from './quickbooks.service';
import { QuickBooksController } from './quickbook.controller';
import { QuickBooksModule, QuickBooksScopes } from '@recursyve/nestjs-quickbooks';

@Module({
  imports: [  QuickBooksModule.forRoot({
    config: {
      mode: 'sandbox',
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      scopes: [QuickBooksScopes.Accounting],
      serverUri: 'http://localhost:3000',
      redirection: {
        successUrl: 'http://localhost:3000/success',
        errorUrl: 'http://localhost:3000/error',
      },
    },
  }),],
controllers: [QuickBooksController],
providers: [QuickBooksService ],
exports: [QuickBooksService],
})
export class QuickbookModule {}

