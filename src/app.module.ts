import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { TasksModule } from './tasks/tasks.module';
import { LeavesModule } from './leaves/leaves.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), TasksModule, LeavesModule],
})
export class AppModule {}
