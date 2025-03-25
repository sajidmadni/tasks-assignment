import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { User } from '../users/user.entity';
import { EventsGateway } from 'src/events/events.gateway';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User]),
    EventsModule
  ],
  controllers: [TasksController], // Register controller
  providers: [TasksService, EventsGateway], // Register service
  exports: [EventsGateway], // Export the WebSocket Gateway
})
export class TasksModule {}
