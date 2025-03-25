import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './event.schema';
import { EventsGateway } from './events.gateway';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>, // Inject Mongoose Model
    private readonly eventsGateway: EventsGateway, // Inject WebSocket Gateway
  ) {}

  async createEvent(type: string, message: string): Promise<Event> {
    const newEvent = new this.eventModel({ type, message });
    const savedEvent = await newEvent.save();

    // Emit event through WebSocket
    this.eventsGateway.server.emit('notification', { type, message });

    return savedEvent;
  }

  async getAllEvents(): Promise<Event[]> {
    return this.eventModel.find().sort({ createdAt: -1 }).exec();
  }

  async sendNotification(message: string) {
    this.eventsGateway.sendNotification(message);
    await this.eventModel.create({ type: 'notification', message });
  }
}
