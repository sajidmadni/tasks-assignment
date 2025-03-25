import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/user.entity';
import { Task } from './tasks/task.entity';  // Import Task entity
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +(process.env.DB_PORT || 5432),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'password',
      database: process.env.DB_NAME || 'my_database',
      entities: [User, Task], // Include Task entity
      synchronize: true, 
      autoLoadEntities: true, // Helps auto-load entities
    }),

    TypeOrmModule.forFeature([User, Task]), // Register for injection
    AuthModule,
    TasksModule,
    MongooseModule.forRoot('mongodb://localhost:27017/mydatabase'), // Ensure this is correct
    EventsModule, // Import EventsModule after setting up Mongoose
  ],
})
export class AppModule {}
