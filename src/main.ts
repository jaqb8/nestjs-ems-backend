import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
// import { authFirebaseMiddleware } from './middleware/auth-firebase.middleware';

async function bootstrap() {
  const serverConfig = config.get('server');
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
  // await app.use(authFirebaseMiddleware);
  logger.log(
    `Application listening on port ${port} in ${process.env.NODE_ENV} mode`,
  );
}
bootstrap();
