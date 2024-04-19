import { Injectable } from '@nestjs/common';
@Injectable()
export class ConfigrationService {
  get authConfig() {
    return {
      privateKey: process.env.JWT_PRIVATE_KEY,
      publicKey: process.env.JWT_PUBLIC_KEY || 'Bookluxery',
      jwtExpirationTime: process.env.JWT_EXPIRATION_TIME,
    };
  }

  get documentationEnabled() {
    return process.env.ENABLE_DOCUMENTATION;
  }

  // get kafkaEnabled(): boolean {
  //   return JSON.parse(process.env.KAFKA_ENABLED);
  // }
  get kafkaConfig() {
    return {
      clientId: process.env.KAFKA_CLIENT_ID,
      brokers: [process.env.KAFKA_BROKERS],
    };
  }

  get appConfig() {
    return {
      port: process.env.PORT || 3000,
    };
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  get nodeEnv(): string {
    return process.env.NODE_ENV || 'development';
  }
  get primaryDBName(): string {
    return 'primaryDB';
  }
  get auditLogDBName(): string {
    return 'auditLogDB';
  }
}
