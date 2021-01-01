import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LeaveDatesDto } from './dto/leave-dates.dto';
import { LeaveStatus } from './leave-status.enum';
import { Leave } from './leave.entity';
import { LeavesService } from './leaves.service';
import { LeaveDatesValidationPipe } from './pipes/leave-dates-validation.pipe';
import { LeaveStatusValidationPipe } from './pipes/leave-status-validation.pipe';

@Controller('leaves')
export class LeavesController {
  private logger = new Logger('LeavesController');

  constructor(private leavesService: LeavesService) {}

  @Get()
  getAllLeaves(): Promise<Leave[]> {
    return this.leavesService.getAllLeaves();
  }

  @Get('/:id')
  getLeaveById(@Param('id', ParseUUIDPipe) id: string): Promise<Leave> {
    return this.leavesService.getLeaveById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createLeave(
    @Body(new LeaveDatesValidationPipe()) leaveDatesDto: LeaveDatesDto,
  ): Promise<Leave> {
    this.logger.verbose(
      `Creating new leave. Data: ${JSON.stringify(leaveDatesDto)}`,
    );
    return this.leavesService.createLeave(leaveDatesDto);
  }

  @Patch('/:id/status')
  updateLeaveStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status', LeaveStatusValidationPipe) status: LeaveStatus,
  ): Promise<Leave> {
    this.logger.verbose(`Updating status of leave with id "${id}".`);
    return this.leavesService.updateLeaveStatus(id, status);
  }

  @Patch('/:id/dates')
  @UsePipes(ValidationPipe)
  updateLeaveDates(
    @Param('id') id: string,
    @Body(new LeaveDatesValidationPipe()) leaveDatesDto: LeaveDatesDto,
  ) {
    this.logger.verbose(
      `Updating dates of leave with id "${id}". Data: ${JSON.stringify(
        leaveDatesDto,
      )}`,
    );
    return this.leavesService.updateLeaveDates(id, leaveDatesDto);
  }

  @Delete('/:id')
  deleteLeave(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    this.logger.verbose(`Deleting leave with ID "${id}".`);
    return this.leavesService.deleteLeave(id);
  }
}
