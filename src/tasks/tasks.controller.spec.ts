import { Test } from '@nestjs/testing';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from './task-status.enum';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

const mockTasksService = () => ({
  createTask: jest.fn(),
  getAllTasks: jest.fn(),
  getTaskById: jest.fn(),
  deleteTask: jest.fn(),
  updateTask: jest.fn(),
});

const mockTask = {
  title: 'Test title',
  description: 'Test description',
  duration: '100',
};

describe('TasksController', () => {
  let tasksController;
  let tasksService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useFactory: mockTasksService,
        },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    tasksController = module.get<TasksController>(TasksController);
  });

  describe('createTask', () => {
    it('should create a task and return it', async () => {
      tasksService.createTask.mockResolvedValue(mockTask);

      expect(tasksService.createTask).not.toHaveBeenCalled();
      const createTaskDto: CreateTaskDto = {
        title: 'test task title',
        description: 'test task description',
        duration: 'test task duration',
      };
      const result = await tasksController.createTask(
        createTaskDto,
        'testUserId',
      );
      expect(tasksService.createTask).toHaveBeenCalledWith(
        createTaskDto,
        'testUserId',
      );
      expect(result).toEqual(mockTask);
    });
  });

  describe('getAllTasks', () => {
    it('should return an array of tasks', async () => {
      tasksService.getAllTasks.mockResolvedValue([mockTask]);

      expect(tasksService.getAllTasks).not.toHaveBeenCalled();
      const result = await tasksController.getAllTasks('testUserId');
      expect(tasksService.getAllTasks).toHaveBeenCalledWith('testUserId');
      expect(result).toEqual([mockTask]);
    });
  });

  describe('getTaskById', () => {
    it('should return a task', async () => {
      tasksService.getTaskById.mockResolvedValue(mockTask);

      expect(tasksService.getTaskById).not.toHaveBeenCalled();
      const result = await tasksController.getTaskById(
        'testTaskId',
        'testUserId',
      );
      expect(tasksService.getTaskById).toHaveBeenCalledWith(
        'testTaskId',
        'testUserId',
      );
      expect(result).toEqual(mockTask);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task and return null', async () => {
      tasksService.deleteTask.mockResolvedValue(null);

      expect(tasksService.deleteTask).not.toHaveBeenCalled();
      const result = await tasksController.deleteTask(
        'testTaskId',
        'testUserId',
      );
      expect(tasksService.deleteTask).toHaveBeenCalledWith(
        'testTaskId',
        'testUserId',
      );
      expect(result).toEqual(null);
    });
  });

  describe('updateTask', () => {
    it('should update a task and return it', async () => {
      tasksService.updateTask.mockResolvedValue({
        title: 'Updated title',
        description: 'Updated description',
        duration: 'Updated duration',
        status: TaskStatus.DONE,
      });

      expect(tasksService.updateTask).not.toHaveBeenCalled();
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated title',
        description: 'Updated description',
        duration: 'Updated duration',
        status: TaskStatus.DONE,
      };
      const result = await tasksController.updateTask(
        'testTaskId',
        updateTaskDto,
        'testUserId',
      );
      expect(tasksService.updateTask).toHaveBeenCalledWith(
        'testTaskId',
        updateTaskDto,
        'testUserId',
      );
      expect(result).toEqual({
        title: 'Updated title',
        description: 'Updated description',
        duration: 'Updated duration',
        status: TaskStatus.DONE,
      });
    });
  });
});
