import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from './event.schema'; // Import Event schema
import { EventsGateway } from './events.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]), // Register EventModel
  ],
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class EventsModule {}
