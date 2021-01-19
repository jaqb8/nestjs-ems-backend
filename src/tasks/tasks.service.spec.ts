import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

type MockType<T> = {
  [P in keyof T]: jest.Mock<{}>;
};

// @ts-ignore
const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  find: jest.fn(),
  findOne: jest.fn(),
}));

const mockTask = {
  title: 'Test title',
  description: 'Test description',
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
});
