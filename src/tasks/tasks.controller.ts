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
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskValidationPipe } from './pipes/update-task-validation.pipe';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
  private logger = new Logger('TaskController');

  constructor(private tasksService: TasksService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUserId() userId: string,
  ): Promise<Task> {
    this.logger.verbose(
      `Creating a new task by user with ID "${userId}". Data: ${JSON.stringify(
        createTaskDto,
      )}`,
    );
    return this.tasksService.createTask(createTaskDto, userId);
  }

  @Get()
  getAllTasks(@GetUserId() userId: string): Promise<Task[]> {
    return this.tasksService.getAllTasks(userId);
  }

  @Get('/:id')
  getTaskById(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUserId() userId: string,
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, userId);
  }

  @Delete('/:id')
  deleteTask(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUserId() userId: string,
  ): Promise<void> {
    this.logger.verbose(`Deleting task with ID "${id}".`);
    return this.tasksService.deleteTask(id, userId);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  updateTask(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new UpdateTaskValidationPipe()) updateTaskDto: UpdateTaskDto,
    @GetUserId() userId: string,
  ): Promise<Task> {
    this.logger.verbose(
      `Updating task with ID "${id}". Data: ${JSON.stringify(updateTaskDto)}`,
    );
    return this.tasksService.updateTask(id, updateTaskDto, userId);
  }
}
