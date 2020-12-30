import { IsDateString, IsOptional } from 'class-validator';

// TODO - remove this DTO
export class UpdateLeaveDatesDto {
  @IsOptional()
  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate: string;
}
