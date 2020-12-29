import { IsDateString } from 'class-validator';

export class CreateLeaveDto {
  @IsDateString()
  startDate: String;

  @IsDateString()
  endDate: String;
}
