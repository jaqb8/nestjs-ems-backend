import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveRepository } from './leave.repository';
import { LeavesService } from './leaves.service';
import { LeavesController } from './leaves.controller';
import { AuthFirebaseMiddleware } from '../middleware/auth-firebase.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([LeaveRepository])],
  providers: [LeavesService],
  controllers: [LeavesController],
})
export class LeavesModule implements NestModule {
  configure(userContext: MiddlewareConsumer) {
    userContext.apply(AuthFirebaseMiddleware).forRoutes('leaves');
  }
}
