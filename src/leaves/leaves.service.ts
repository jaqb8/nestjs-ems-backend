import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { Leave } from './leave.entity';
import { LeaveRepository } from './leave.repository';
import { v4 as uuid } from 'uuid';
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

  async getLeaveById(id: String): Promise<Leave> {
    const found = await this.leaveRepository.findOne({ id });

    if (!found) {
      throw new NotFoundException(`Leave with id "${id}" not found.`);
    }

    return found;
  }

  async createLeave(createLeaveDto: CreateLeaveDto): Promise<Leave> {
    const { startDate, endDate } = createLeaveDto;

    const leave = this.leaveRepository.create({
      id: uuid(),
      startDate,
      endDate,
      status: LeaveStatus.PENDING_APPROVAL,
    });

    return await this.leaveRepository.save(leave);
  }

  async updateLeaveStatus(id: String, status: LeaveStatus): Promise<Leave> {
    const leave = await this.getLeaveById(id);
    return await this.leaveRepository.save({
      ...leave,
      status,
    });
  }

  async deleteLeave(id: String): Promise<void> {
    this.leaveRepository.delete({ id });
  }
}
