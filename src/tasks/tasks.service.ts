import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { v4 as uuid } from 'uuid';
import { TaskStatus } from './task-status.enum';

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
}
