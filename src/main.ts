import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import admin from 'firebase-admin';

async function bootstrap() {
  const serverConfig = config.get('server');
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://ems-employee-managment-system.firebaseio.com',
  });

  if (admin.apps.length > 0) {
    logger.log('Firebase app successfully initialized.');
  }

  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  } else {
    app.enableCors();
  }

  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
  logger.log(
    `Application listening on port ${port} in ${process.env.NODE_ENV} mode`,
  );
}
bootstrap();
