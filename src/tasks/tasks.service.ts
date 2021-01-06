import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { v4 as uuid } from 'uuid';
import { TaskStatus } from './task-status.enum';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  async createTask(
    createTaskDto: CreateTaskDto,
    userId: string,
  ): Promise<Task> {
    const { title, description, duration } = createTaskDto;

    const task = this.taskRepository.create({
      id: uuid(),
      title,
      description,
      duration,
      status: TaskStatus.OPEN,
      userId,
    });

    try {
      return await this.taskRepository.save(task);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getAllTasks(userId: string): Promise<Task[]> {
    return await this.taskRepository.find({
      where: {
        userId: {
          $eq: userId,
        },
      },
    });
  }

  async getTaskById(id: string, userId: string): Promise<Task> {
    const found = await this.taskRepository.findOne({ id, userId });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found.`);
    }

    return found;
  }

  async deleteTask(id: string, userId: string): Promise<void> {
    await this.taskRepository.delete({ id, userId });
  }

  async updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<Task> {
    const { title, description, duration, status } = updateTaskDto;
    const task = await this.getTaskById(id, userId);

    if (title) task.title = title;
    if (description) task.description = description;
    if (duration) task.duration = duration;
    if (status) task.status = status;

    return await this.taskRepository.save(task);
  }
}
