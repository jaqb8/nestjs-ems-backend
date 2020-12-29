import { BadRequestException, PipeTransform } from '@nestjs/common';
import { LeaveStatus } from '../leave-status.enum';

export class LeaveStatusValidationPipe implements PipeTransform {
  private allowedStatuses = [
    LeaveStatus.PENDING_APPROVAL,
    LeaveStatus.APPROVED,
    LeaveStatus.REJECTED,
  ];

  transform(value: any) {
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`"${value}" is an invalid status.`);
    }

    return value;
  }

  private isStatusValid(status: any): boolean {
    const idx = this.allowedStatuses.indexOf(status);
    return idx !== -1;
  }
}
