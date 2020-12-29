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
import { CreateLeaveDto } from './dto/create-leave.dto';
import { LeaveStatus } from './leave-status.enum';
import { Leave } from './leave.entity';
import { LeavesService } from './leaves.service';
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
  getLeaveById(@Param('id', ParseUUIDPipe) id: String): Promise<Leave> {
    return this.leavesService.getLeaveById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createLeave(@Body() createLeaveDto: CreateLeaveDto): Promise<Leave> {
    this.logger.verbose(
      `Creating new leave. Data: ${JSON.stringify(createLeaveDto)}`,
    );
    return this.leavesService.createLeave(createLeaveDto);
  }

  @Patch('/:id')
  updateLeaveStatus(
    @Param('id', ParseUUIDPipe) id: String,
    @Body('status', LeaveStatusValidationPipe) status: LeaveStatus,
  ): Promise<Leave> {
    this.logger.verbose(`Updating status of leave with id "${id}".`);
    return this.leavesService.updateLeaveStatus(id, status);
  }

  @Delete('/:id')
  deleteLeave(@Param('id', ParseUUIDPipe) id: String): Promise<void> {
    this.logger.verbose(`Deleting leave with ID "${id}".`);
    return this.leavesService.deleteLeave(id);
  }
}
