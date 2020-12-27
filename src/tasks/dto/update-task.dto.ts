import { IsNumberString, IsOptional, Validate } from 'class-validator';
import { TaskStatusConstraint } from '../validation/task-status-validation.constraint';
import { TaskStatus } from '../task-status.enum';

export class UpdateTaskDto {
  title: string;

  description: string;

  @IsOptional()
  @IsNumberString()
  duration: string;

  @IsOptional()
  @Validate(TaskStatusConstraint)
  status: TaskStatus;
}
