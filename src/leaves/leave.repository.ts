import { EntityRepository, Repository } from 'typeorm';
import { Leave } from './leave.entity';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import { v4 as uuid } from 'uuid';
import { LeaveDatesDto } from './dto/leave-dates.dto';
import { LeaveStatus } from './leave-status.enum';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateLeaveDatesDto } from './dto/update-leave-dates.dto';
const moment = extendMoment(Moment);

@EntityRepository(Leave)
export class LeaveRepository extends Repository<Leave> {
  async createLeave(leaveDatesDto: LeaveDatesDto): Promise<Leave> {
    const { startDate, endDate } = leaveDatesDto;

    const newLeaveRange: [string, string] = [startDate, endDate];

    if (!this.isNewLeaveValid(newLeaveRange)) {
      throw new BadRequestException(
        'Requested date of leave overlaps with other one.',
      );
    }

    const leave = this.create({
      id: uuid(),
      startDate,
      endDate,
      status: LeaveStatus.PENDING_APPROVAL,
    });

    return await this.save(leave);
  }

  async updateLeaveDates(id: string, updateLeaveDatesDto: UpdateLeaveDatesDto) {
    const { startDate, endDate } = updateLeaveDatesDto;
    const leave = await this.getLeaveById(id);
    if (startDate) leave.startDate;
    if (endDate) leave.endDate;

    const newLeaveRange: [string, string] = [leave.startDate, leave.endDate];

    if (!this.isNewLeaveValid(newLeaveRange)) {
      throw new BadRequestException(
        'Requested date of leave overlaps with other one.',
      );
    }

    return this.save(leave);
  }

  async getLeaveById(id: string): Promise<Leave> {
    const found = await this.findOne({ id });

    if (!found) {
      throw new NotFoundException(`Leave with id "${id}" not found.`);
    }

    return found;
  }

  private async isNewLeaveValid(newLeaveRange: [string, string]) {
    const overlapingRanges = await this.getOverlapingLeaves(newLeaveRange);
    return overlapingRanges.length === 0;
  }

  private async getOverlapingLeaves(
    newLeaveRange: [string, string],
  ): Promise<Leave[]> {
    const allLeaves = await this.find();
    const overlapingRanges = allLeaves.filter((leave) =>
      LeaveRepository.checkIfDatesOverlap(newLeaveRange, [
        leave.startDate,
        leave.endDate,
      ])
        ? leave
        : null,
    );

    return overlapingRanges;
  }

  private static checkIfDatesOverlap(
    dateRange1: [string, string],
    dateRange2: [string, string],
  ): boolean {
    const momentRange1 = moment.range(
      new Date(dateRange1[0]),
      new Date(dateRange1[1]),
    );
    const momentRange2 = moment.range(
      new Date(dateRange2[0]),
      new Date(dateRange2[1]),
    );

    return momentRange1.overlaps(momentRange2);
  }
}
