import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { TaskStatus } from '../task-status.enum';

// TODO - make it validation pipe on entire DTO
@ValidatorConstraint({ name: 'taskStatusConstraint', async: false })
export class TaskStatusConstraint implements ValidatorConstraintInterface {
  private allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];

  validate(
    value: string,
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    value = value.toUpperCase();
    return this.isStatusValid(value);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Invalid task status.';
  }

  private isStatusValid(status: any): boolean {
    const idx = this.allowedStatuses.indexOf(status);
    return idx !== -1;
  }
}
