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
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskValidationPipe } from './pipes/update-task-validation.pipe';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  private logger = new Logger('TaskController');

  constructor(private tasksService: TasksService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    this.logger.verbose(
      `Creating a new task. Data: ${JSON.stringify(createTaskDto)}`,
    );
    return this.tasksService.createTask(createTaskDto);
  }

  @Get()
  getAllTasks(): Promise<Task[]> {
    return this.tasksService.getAllTasks();
  }

  @Get('/:id')
  getTaskById(@Param('id', ParseUUIDPipe) id: string): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Delete('/:id')
  deleteTask(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    this.logger.verbose(`Deleting task with ID "${id}".`);
    return this.tasksService.deleteTask(id);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  updateTask(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new UpdateTaskValidationPipe()) updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    this.logger.verbose(
      `Updating task with ID "${id}". Data: ${JSON.stringify(updateTaskDto)}`,
    );
    return this.tasksService.updateTask(id, updateTaskDto);
  }
}
