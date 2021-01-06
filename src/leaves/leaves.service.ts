import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LeaveDatesDto } from './dto/leave-dates.dto';
import { Leave } from './leave.entity';
import { LeaveRepository } from './leave.repository';
import { LeaveStatus } from './leave-status.enum';

@Injectable()
export class LeavesService {
  constructor(
    @InjectRepository(LeaveRepository)
    private leaveRepository: LeaveRepository,
  ) {}

  async getAllLeaves(userId: string): Promise<Leave[]> {
    return await this.leaveRepository.find({
      where: {
        userId: {
          $eq: userId,
        },
      },
    });
  }

  async getLeaveById(id: string, userId: string): Promise<Leave> {
    return this.leaveRepository.getLeaveById(id, userId);
  }

  async createLeave(
    leaveDatesDto: LeaveDatesDto,
    userId: string,
  ): Promise<Leave> {
    return this.leaveRepository.createLeave(leaveDatesDto, userId);
  }

  async updateLeaveStatus(
    id: string,
    status: LeaveStatus,
    userId: string,
  ): Promise<Leave> {
    const leave = await this.getLeaveById(id, userId);
    if (leave.status !== status) {
      leave.status = status;
      return await this.leaveRepository.save(leave);
    }
    return leave;
  }

  async updateLeaveDates(
    id: string,
    leaveDatesDto: LeaveDatesDto,
    userId: string,
  ): Promise<Leave> {
    return this.leaveRepository.updateLeaveDates(id, leaveDatesDto, userId);
  }

  async deleteLeave(id: string, userId: string): Promise<void> {
    this.leaveRepository.delete({ id, userId });
  }
}
