
import { Controller, Get, Redirect, Req, Res } from '@nestjs/common';
import axios from 'axios';
import OAuth = require("oauth-1.0a") // Update import statement
import crypto from 'crypto';
import { Request, Response } from 'express';

@Controller('oauth')
export class QuickBooksController {
  private readonly oauth: OAuth;

  constructor() {
    this.oauth = new OAuth({
      consumer: {
        key: 'ABLhMoOKW0UZohFCxuoVFccKBZ5pJnKbr4S1e4Rj3N7Swn3Ngg',
        secret: 'VHSSeFJPzgMFfpQoqo2EzV1bE7lChmdicqNCQt1P',
      },
      signature_method: 'HMAC-SHA1',
      hash_function(base_string, key) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64');
      },
    });
  }

  @Get('request-token')
  async getRequestToken(@Req() req: Request, @Res() res: Response) {
    try {
      // Step 1: Obtain Temporary Credentials (Request Token)
      const requestData = {
        url: 'REQUEST_TOKEN_ENDPOINT', // Replace with QuickBooks request token endpoint
        method: 'POST',
      };

      const tokenResponse = await axios.post(requestData.url, {
        headers: this.oauth.toHeader(this.oauth.authorize({ url: requestData.url, method: 'POST' })),
      });

      // Step 2: Redirect the user to the authorization URL (QuickBooks authorization URL)

      // Save temporary credentials (request token and secret) for later use

      // Redirect the user to the QuickBooks authorization URL
      res.redirect(tokenResponse.data.authorize_url);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Error during token exchange');
    }
  }

  @Get('callback')
  async handleCallback(@Req() req: Request, @Res() res: Response) {
    try {
      // Step 3: Exchange Temporary Credentials for Access Tokens
      const requestData = {
        url: 'ACCESS_TOKEN_ENDPOINT', // Replace with QuickBooks access token endpoint
        method: 'POST',
        data: {
          oauth_verifier: req.query.oauth_verifier,
        },
      };

      // Make HTTP request using Axios
      const tokenResponse = await axios.post(requestData.url, {
        headers: this.oauth.toHeader(this.oauth.authorize({ url: requestData.url, method: 'POST' })),
        data: requestData.data,
      });

      // Step 4: Use access tokens for making authenticated requests to QuickBooks API

      // Store access tokens securely for later use
      const accessToken = tokenResponse.data.token;

      // Now you can use accessToken to make authenticated requests to QuickBooks API

      res.send('Token exchange successful');
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Error during token exchange');
    }
  }
}
