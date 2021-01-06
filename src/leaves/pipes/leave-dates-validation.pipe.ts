import { BadRequestException, PipeTransform } from '@nestjs/common';
import { LeaveDatesDto } from '../dto/leave-dates.dto';
import * as moment from 'moment';

export class LeaveDatesValidationPipe implements PipeTransform<LeaveDatesDto> {
  transform(leaveDatesDto: LeaveDatesDto) {
    if (!this.isRangeValid(leaveDatesDto)) {
      throw new BadRequestException(
        'The start date cannot be after the end date.',
      );
    }
    return leaveDatesDto;
  }

  private isRangeValid(leaveDatesDto: LeaveDatesDto): boolean {
    const { startDate, endDate } = leaveDatesDto;
    return moment(startDate).isBefore(endDate);
  }
}
