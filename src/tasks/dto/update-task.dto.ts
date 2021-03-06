import { IsNumberString, IsOptional } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class UpdateTaskDto {
  title: string;

  description: string;

  @IsOptional()
  @IsNumberString()
  duration: string;

  status: TaskStatus;
}
