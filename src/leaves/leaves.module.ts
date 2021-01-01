import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveRepository } from './leave.repository';
import { LeavesService } from './leaves.service';
import { LeavesController } from './leaves.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LeaveRepository])],
  providers: [LeavesService],
  controllers: [LeavesController],
})
export class LeavesModule {}
