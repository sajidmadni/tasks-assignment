import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { EventsGateway } from './events.gateway';
import { getModelToken } from '@nestjs/mongoose';
import { Event } from './event.schema';

describe('EventsService', () => {
  let service: EventsService;
  let gateway: EventsGateway;

  const mockGateway = {
    sendNotification: jest.fn(),
  };

  const mockEventModel = {
    create: jest.fn().mockResolvedValue({ type: 'notification', message: 'Test message' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: EventsGateway, useValue: mockGateway }, // Mock WebSocket Gateway
        { provide: getModelToken(Event.name), useValue: mockEventModel }, // Mock Mongoose Model
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    gateway = module.get<EventsGateway>(EventsGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send a notification and save it', async () => {
    const message = 'Test message';

    await service.sendNotification(message);

    expect(gateway.sendNotification).toHaveBeenCalledWith(message); // Verify WebSocket call
    expect(mockEventModel.create).toHaveBeenCalledWith({ type: 'notification', message }); // Verify DB call
  });
});
