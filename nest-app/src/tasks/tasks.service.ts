import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { User } from '../users/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { EventsGateway } from '../events/events.gateway'; // Import WebSocket Gateway

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly eventsGateway: EventsGateway, // Inject WebSocket Gateway
  ) {}

  // Create a new task
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description, assignedTo } = createTaskDto;
  
    let user: User | undefined = undefined; // Default value is undefined
    if (assignedTo) {
      user = (await this.userRepository.findOne({ where: { id: Number(assignedTo) } })) || undefined;
      if (!user) throw new NotFoundException('Assigned user not found');
    }
  
    const task = this.taskRepository.create({ title, description, assignedTo: user });
    const savedTask = await this.taskRepository.save(task);

    // Notify user (if assigned) about the new task
    if (user) {
      this.eventsGateway.server.to(user.id.toString()).emit('task-assigned', {
        taskId: savedTask.id,
        message: `You have been assigned a new task: ${savedTask.title}`,
      });
    }

    return savedTask;
  }

  // Get all tasks
  async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.find({ relations: ['assignedTo'] });
  }

  // Get task by ID
  async getTaskById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id }, relations: ['assignedTo'] });
    if (!task) throw new NotFoundException(`Task with ID ${id} not found`);
    return task;
  }

  // Update task and notify users
  async updateTask(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.getTaskById(id);

    if (updateTaskDto.title) task.title = updateTaskDto.title;
    if (updateTaskDto.description) task.description = updateTaskDto.description;

    if (updateTaskDto.assignedTo) {
      const user = await this.userRepository.findOne({ where: { id: updateTaskDto.assignedTo } });
      if (!user) throw new NotFoundException('Assigned user not found');
      task.assignedTo = user;
    }

    const updatedTask = await this.taskRepository.save(task);

    // Notify user about task update
    this.eventsGateway.server.emit('task-updated', {
      taskId: updatedTask.id,
      message: `Task "${updatedTask.title}" has been updated.`,
    });

    return updatedTask;
  }

  // Delete task
  async deleteTask(id: number): Promise<void> {
    const task = await this.getTaskById(id);
    await this.taskRepository.remove(task);

    // Notify users about task deletion
    this.eventsGateway.server.emit('task-deleted', {
      taskId: id,
      message: `Task "${task.title}" has been deleted.`,
    });
  }
}
