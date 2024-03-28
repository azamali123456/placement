// quickbooks.service.ts
import { Injectable } from '@nestjs/common';
import * as QuickBooks from 'node-quickbooks';
import fs from 'fs';

@Injectable()
export class QuickBooksService {
  private readonly quickbooks;

  constructor() {
    this.quickbooks = new QuickBooks(
      'client_id',
      'client_secret',
      'access_token',  // You should store and retrieve this securely
      'refresh_token', // You should store and retrieve this securely
      'realmId',
      true,            // Use sandbox environment if true
      true             // Debug mode
    );
  }

  getAuthorizeUrl(): string {
    // Return the authorization URL
    return this.quickbooks.authorizeUrl({
      scope: [QuickBooks.scopes.Accounting],
      state: 'some_random_state',
    });
  }

  async getData(): Promise<any> {
    // Use the QuickBooks API to fetch data
    return new Promise((resolve, reject) => {
      this.quickbooks.findAccounts({}, (error, accounts) => {
        if (error) {
          reject(error);
        } else {
          resolve(accounts);
        }
      });
    });
  }

  getQWCFile(): string {
    // Generate and return the QWC XML file content
    const qwcContent = this.generateQWCFile();
    fs.writeFileSync('your-app.qwc', qwcContent);
    return qwcContent;
  }

  private generateQWCFile(): string {
    // Create and return the QWC XML file content
    const qwcContent = `
      <?xml version="1.0" encoding="utf-8"?>
      <QBWCXML>
        <!-- ... Your QWC XML content ... -->
      </QBWCXML>
    `;
    return qwcContent;
  }
}
