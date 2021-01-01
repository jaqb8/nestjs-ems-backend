import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

interface UpdateTaskData {
  title: string;
  description: string;
  duration: string;
  status: string;
}

export class UpdateTaskValidationPipe implements PipeTransform<UpdateTaskData> {
  private allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];

  transform(value: UpdateTaskData) {
    this.checkIfDataProvided(value);

    if (value.status) {
      value.status = value.status.toUpperCase();
    }

    this.checkIfValidStatus(value.status);
    return value;
  }

  private checkIfDataProvided(data: UpdateTaskData): void {
    const { title, description, duration, status } = data;
    if (!title && !description && !duration && !status) {
      throw new BadRequestException('Update data not provided.');
    }
  }

  private checkIfValidStatus(status: string): void {
    if (status && !this.isStatusInEnum(status)) {
      throw new BadRequestException(`"${status}" is an invalid status`);
    }
  }

  private isStatusInEnum(status: string): boolean {
    const idx = this.allowedStatuses.indexOf(<TaskStatus>status);
    return idx !== -1;
  }
}
