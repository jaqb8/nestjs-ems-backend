import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

type MockType<T> = {
  [P in keyof T]: jest.Mock<{}>;
};

// @ts-ignore
const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
}));

const mockTask = {
  title: 'Test title',
  description: 'Test description',
  duration: '100',
};

describe('TasksService', () => {
  let tasksService;
  let taskRepository: MockType<Repository<Task>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get(getRepositoryToken(Task));
  });

  describe('createTask', () => {
    it('creates a new task', async () => {
      taskRepository.save.mockReturnValue(mockTask);

      expect(taskRepository.create).not.toHaveBeenCalled();
      const createTaskDto: CreateTaskDto = {
        title: mockTask.title,
        description: mockTask.description,
        duration: mockTask.duration,
      };
      const result = await tasksService.createTask(createTaskDto, 'testUserId');
      expect(taskRepository.create).toHaveBeenCalled();
      expect(taskRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockTask);
    });
  });

  describe('getTasks', () => {
    it('gets all tasks from repository', async () => {
      taskRepository.find.mockReturnValue('someValue');

      expect(taskRepository.find).not.toHaveBeenCalled();
      const result = await tasksService.getAllTasks();
      expect(taskRepository.find).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('gets one task from repository by ID', async () => {
      taskRepository.findOne.mockReturnValue(mockTask);

      expect(taskRepository.findOne).not.toHaveBeenCalled();
      const result = await tasksService.getTaskById('testTaskId', 'testUserId');
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        id: 'testTaskId',
        userId: 'testUserId',
      });
      expect(result).toEqual(mockTask);
    });

    it('throws an error as task is not found', () => {
      taskRepository.findOne.mockReturnValue(null);

      expect(
        tasksService.getTaskById('testTaskId', 'testUserId'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteTask', () => {
    it('deletes a task', async () => {
      taskRepository.delete.mockReturnValue(null);

      expect(taskRepository.delete).not.toHaveBeenCalled();
      await tasksService.deleteTask('testTaskId', 'testUserId');
      expect(taskRepository.delete).toHaveBeenCalledWith({
        id: 'testTaskId',
        userId: 'testUserId',
      });
    });
  });

  describe('updateTask', () => {
    it('updates a task title', async () => {
      taskRepository.save.mockReturnValue({
        ...mockTask,
        title: 'Updated test title',
      });
      tasksService.getTaskById = jest.fn().mockResolvedValue(mockTask);

      expect(tasksService.getTaskById).not.toHaveBeenCalled();
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated test title',
        description: undefined,
        duration: undefined,
        status: undefined,
      };
      const result = await tasksService.updateTask(
        'testTaskId',
        updateTaskDto,
        'testUserId',
      );
      expect(tasksService.getTaskById).toHaveBeenCalledWith(
        'testTaskId',
        'testUserId',
      );
      expect(taskRepository.save).toHaveBeenCalled();
      expect(result).toEqual({
        ...mockTask,
        title: 'Updated test title',
      });
    });
  });
});
