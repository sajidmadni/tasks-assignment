import { Test, TestingModule } from '@nestjs/testing';
import { EventsGateway } from './events.gateway';
import { Server } from 'socket.io';

describe('EventsGateway', () => {
  let gateway: EventsGateway;

  const mockServer = {
    emit: jest.fn(), // Mock WebSocket emit function
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventsGateway],
    }).compile();

    gateway = module.get<EventsGateway>(EventsGateway);
    gateway.server = mockServer as unknown as Server; // Mock WebSocket server
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should emit a notification event', () => {
    const message = 'Task assigned';

    gateway.sendNotification(message);

    expect(mockServer.emit).toHaveBeenCalledWith('notification', { message });
  });
});
