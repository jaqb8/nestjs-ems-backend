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

  async getAllLeaves(): Promise<Leave[]> {
    return await this.leaveRepository.find();
  }

  async getLeaveById(id: string): Promise<Leave> {
    return this.leaveRepository.getLeaveById(id);
  }

  async createLeave(leaveDatesDto: LeaveDatesDto): Promise<Leave> {
    return this.leaveRepository.createLeave(leaveDatesDto);
  }

  async updateLeaveStatus(id: string, status: LeaveStatus): Promise<Leave> {
    const leave = await this.getLeaveById(id);
    leave.status = status;
    return await this.leaveRepository.save(leave);
  }

  async updateLeaveDates(
    id: string,
    leaveDatesDto: LeaveDatesDto,
  ): Promise<Leave> {
    return this.leaveRepository.updateLeaveDates(id, leaveDatesDto);
  }

  async deleteLeave(id: string): Promise<void> {
    this.leaveRepository.delete({ id });
  }
}
