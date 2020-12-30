import { IsDateString } from 'class-validator';

export class LeaveDatesDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
