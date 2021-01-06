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
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GetUserId } from '../decorators/get-user-id.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { LeaveDatesDto } from './dto/leave-dates.dto';
import { LeaveStatus } from './leave-status.enum';
import { Leave } from './leave.entity';
import { LeavesService } from './leaves.service';
import { LeaveDatesValidationPipe } from './pipes/leave-dates-validation.pipe';
import { LeaveStatusValidationPipe } from './pipes/leave-status-validation.pipe';

@Controller('leaves')
@UseGuards(AuthGuard)
export class LeavesController {
  private logger = new Logger('LeavesController');

  constructor(private leavesService: LeavesService) {}

  @Get()
  getAllLeaves(@GetUserId() userId: string): Promise<Leave[]> {
    return this.leavesService.getAllLeaves(userId);
  }

  @Get('/:id')
  getLeaveById(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUserId() userId: string,
  ): Promise<Leave> {
    return this.leavesService.getLeaveById(id, userId);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createLeave(
    @Body(new LeaveDatesValidationPipe()) leaveDatesDto: LeaveDatesDto,
    @GetUserId() userId: string,
  ): Promise<Leave> {
    this.logger.verbose(
      `Creating new leave. Data: ${JSON.stringify(leaveDatesDto)}`,
    );
    return this.leavesService.createLeave(leaveDatesDto, userId);
  }

  @Patch('/:id/status')
  updateLeaveStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status', LeaveStatusValidationPipe) status: LeaveStatus,
    @GetUserId() userId: string,
  ): Promise<Leave> {
    this.logger.verbose(`Updating status of leave with id "${id}".`);
    return this.leavesService.updateLeaveStatus(id, status, userId);
  }

  @Patch('/:id/dates')
  @UsePipes(ValidationPipe)
  updateLeaveDates(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new LeaveDatesValidationPipe()) leaveDatesDto: LeaveDatesDto,
    @GetUserId() userId: string,
  ) {
    this.logger.verbose(
      `Updating dates of leave with id "${id}". Data: ${JSON.stringify(
        leaveDatesDto,
      )}`,
    );
    return this.leavesService.updateLeaveDates(id, leaveDatesDto, userId);
  }

  @Delete('/:id')
  deleteLeave(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUserId() userId: string,
  ): Promise<void> {
    this.logger.verbose(`Deleting leave with ID "${id}".`);
    return this.leavesService.deleteLeave(id, userId);
  }
}
