import { EntityRepository, Repository } from 'typeorm';
import { Leave } from './leave.entity';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import { v4 as uuid } from 'uuid';
import { LeaveDatesDto } from './dto/leave-dates.dto';
import { LeaveStatus } from './leave-status.enum';
import { BadRequestException, NotFoundException } from '@nestjs/common';
const moment = extendMoment(Moment);

@EntityRepository(Leave)
export class LeaveRepository extends Repository<Leave> {
  async createLeave(leaveDatesDto: LeaveDatesDto): Promise<Leave> {
    const { startDate, endDate } = leaveDatesDto;

    const newLeaveRange: [string, string] = [startDate, endDate];

    if (!(await this.isNewLeaveValid(newLeaveRange))) {
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

  async updateLeaveDates(id: string, leaveDatesDto: LeaveDatesDto) {
    const { startDate, endDate } = leaveDatesDto;
    const leave = await this.getLeaveById(id);
    leave.startDate = startDate;
    leave.endDate = endDate;

    const newLeaveRange: [string, string] = [leave.startDate, leave.endDate];

    if (!(await this.isNewLeaveValid(newLeaveRange, id))) {
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

  private async isNewLeaveValid(newLeaveRange: [string, string], id?: string) {
    const overlapingRanges = await this.getOverlapingLeaves(newLeaveRange, id);
    return overlapingRanges.length === 0;
  }

  private async getOverlapingLeaves(
    newLeaveRange: [string, string],
    id?: string,
  ): Promise<Leave[]> {
    const allLeaves = !id
      ? await this.find()
      : await this.find({
          where: {
            id: {
              $not: {
                $eq: id,
              },
            },
          },
        });
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
