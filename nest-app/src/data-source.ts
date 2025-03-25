import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { Task } from './tasks/task.entity';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'myuser',
    password: process.env.DB_PASS || 'mypassword', // Use DB_PASS here
    database: process.env.DB_NAME || 'mydb',
    entities: [User, Task],
    migrations: ['dist/migrations/*.js'],
    synchronize: false,
    logging: true,
  });
  console.log('Loaded Entities:', AppDataSource.options.entities);

