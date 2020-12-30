import { BadRequestException, PipeTransform } from '@nestjs/common';
import { LeaveStatus } from '../leave-status.enum';

export class LeaveStatusValidationPipe implements PipeTransform<string> {
  private allowedStatuses = [
    LeaveStatus.PENDING_APPROVAL,
    LeaveStatus.APPROVED,
    LeaveStatus.REJECTED,
  ];

  transform(status: string) {
    if (status) {
      status = status.toUpperCase();
    }

    if (!this.isStatusValid(status)) {
      throw new BadRequestException(
        `"${status === undefined ? '' : status}" is an invalid status.`,
      );
    }

    return status;
  }

  private isStatusValid(status: string): boolean {
    const idx = this.allowedStatuses.indexOf(<LeaveStatus>status);
    return idx !== -1;
  }
}
