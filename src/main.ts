import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { middleware as expressCtx } from 'express-ctx';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { AppModule } from './app.module';
// import { setupSwagger } from './setup-swagger';
import { ConfigrationService } from './configration/configration.service';
import { ConfigrationModule } from './configration/configration.module';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { urlencoded, json } from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { cors: true },
  );
  const configService = app.select(ConfigrationModule).get(ConfigrationService);

  // if (configService.kafkaEnabled) {
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.KAFKA,
  //   options: {
  //     client: {
  //       brokers: ['localhost:29092'],
  //     },
  //     consumer: {
  //       groupId: 'log-consumer',
  //     },
  //   },
  // });

  //   await app.startAllMicroservices();
  // }

  app.set('trust proxy', 1); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  app.use(helmet());
  // app.setGlobalPrefix('/api'); use api as global prefix if you don't have subdomain
  // app.use(
  //   rateLimit({
  //     windowMs: 15 * 60 * 1000, // 15 minutes
  //     max: 100, // limit each IP to 100 requests per windowMs
  //   }),
  // );

  app.use(json({ limit: '25mb' }));
  app.use(urlencoded({ extended: true, limit: '25mb' }));
  app.useStaticAssets(join(__dirname, '..', 'assets'));

  app.enableVersioning();

  app.useGlobalPipes(new ValidationPipe({}));

  // if (configService.documentationEnabled) {
  //   setupSwagger(app);
  // }

  app.use(expressCtx);

  // Starts listening for shutdown hooks
  if (!configService.isDevelopment) {
    app.enableShutdownHooks();
  }

  const port = configService.appConfig.port;
  await app.listen(port);
  console.info(`server running on ${await app.getUrl()}`);

  return app;
}
bootstrap();
