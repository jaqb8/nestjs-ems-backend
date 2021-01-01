import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthFirebaseMiddleware } from '../middleware/auth-firebase.middleware';
import { TaskRepository } from './task.repository';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskRepository])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule implements NestModule {
  configure(userContext: MiddlewareConsumer) {
    userContext.apply(AuthFirebaseMiddleware).forRoutes('tasks');
  }
}
