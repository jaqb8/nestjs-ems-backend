import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { LeavesModule } from './leaves/leaves.module';
import { SecretsReader } from './gcp-secrets';
import * as config from 'config';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const dbConfig = config.get('db');

        let mongoUri: string;

        if (process.env.NODE_ENV === 'development') {
          mongoUri = dbConfig.url;
        } else {
          const secretsReader = new SecretsReader();
          mongoUri = await secretsReader.getSecretValue(dbConfig.url, '1');
        }

        return { ...typeOrmConfig, url: mongoUri };
      },
    }),
    TasksModule,
    LeavesModule,
  ],
})
export class AppModule {}
