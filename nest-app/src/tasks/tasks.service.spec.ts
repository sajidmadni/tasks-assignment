import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { EventsGateway } from '../events/events.gateway';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';

describe('TasksService', () => {
  let service: TasksService;
  let taskRepository: Repository<Task>;
  let userRepository: Repository<User>;
  let eventsGateway: EventsGateway;

  const mockTaskRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((task) => Promise.resolve({ id: 1, ...task })),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockServer = {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
  };

  const mockEventsGateway = {
    server: mockServer, // Mock WebSocket server
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: mockTaskRepository },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: EventsGateway, useValue: mockEventsGateway },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    taskRepository = module.get(getRepositoryToken(Task));
    userRepository = module.get(getRepositoryToken(User));
    eventsGateway = module.get<EventsGateway>(EventsGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw NotFoundException if assigned user does not exist', async () => {
    const createTaskDto: CreateTaskDto = {
      title: 'Test Task',
      description: 'Test Description',
      assignedTo: 99, // Non-existent user ID
    };
  
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null); // Ensure user is NOT found
  
    const emitSpy = jest.spyOn(eventsGateway.server, 'emit'); // Spy on emit method
  
    await expect(service.createTask(createTaskDto)).rejects.toThrow(NotFoundException);
  
    expect(emitSpy).not.toHaveBeenCalled(); // Ensure the event is NOT emitted
  });

  it('should throw NotFoundException if assigned user does not exist', async () => {
    const createTaskDto = { title: 'Test Task', description: 'Test Description', assignedTo: 999 };

    mockUserRepository.findOne.mockResolvedValue(undefined); // Simulate user not found

    await expect(service.createTask(createTaskDto)).rejects.toThrow(NotFoundException);
    expect(taskRepository.create).not.toHaveBeenCalled();
    expect(taskRepository.save).not.toHaveBeenCalled();
    expect(mockServer.emit).not.toHaveBeenCalled();
  });
});
