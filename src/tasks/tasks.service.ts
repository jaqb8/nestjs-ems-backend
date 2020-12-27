import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { v4 as uuid } from 'uuid';
import { TaskStatus } from './task-status.enum';
import { UpdateTaskDto } from './dto/update-task.dto';
import { stat } from 'fs';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description, duration } = createTaskDto;

    const task = this.taskRepository.create({
      id: uuid(),
      title,
      description,
      duration,
      status: TaskStatus.OPEN,
    });

    return await this.taskRepository.save(task);
  }

  async getAllTasks(): Promise<Task[]> {
    return await this.taskRepository.find();
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.findOne({ id });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found.`);
    }

    return found;
  }

  async deleteTask(id: string): Promise<void> {
    await this.taskRepository.delete({ id });
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    let { title, description, duration, status } = updateTaskDto;

    if (!title && !description && !duration && !status) {
      throw new BadRequestException('Update data not provided.');
    }

    const task = await this.getTaskById(id);
    return await this.taskRepository.save({
      ...task,
      ...updateTaskDto,
    });
  }
}
