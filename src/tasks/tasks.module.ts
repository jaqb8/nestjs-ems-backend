import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthFirebaseMiddleware } from '../middleware/auth-firebase.middleware';
import { Task } from './task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule implements NestModule {
  configure(userContext: MiddlewareConsumer) {
    userContext.apply(AuthFirebaseMiddleware).forRoutes('tasks');
  }
}
