import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true }) // Enable CORS for WebSocket
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  notifyTaskUpdate(taskId: string, message: string) {
    this.server.emit('task-update', { taskId, message });
  }

  notifyTaskAssignment(userId: string, taskId: string) {
    this.server.to(userId).emit('task-assigned', { taskId, message: `New task assigned: ${taskId}` });
  }

  sendNotification(message: string) {
    this.server.emit('notification', { message });
  }
}
