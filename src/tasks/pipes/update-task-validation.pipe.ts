import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

interface UpdateTaskData {
  title: String;
  description: String;
  duration: String;
  status: String;
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

  private checkIfValidStatus(status: String): void {
    if (status && !this.isStatusInEnum(status)) {
      throw new BadRequestException(`"${status}" is an invalid status`);
    }
  }

  private isStatusInEnum(status: any): boolean {
    const idx = this.allowedStatuses.indexOf(status);
    return idx !== -1;
  }
}
