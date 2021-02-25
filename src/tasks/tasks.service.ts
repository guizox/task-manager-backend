import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.model';
import { CreateTaskDTO } from './dto/create-task-dto';
import { GetTasksFitlerDTO } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) { }

  async getTasks(getTasksDTO: GetTasksFitlerDTO, user: User): Promise<Task[]> {
    return await this.taskRepository.getTasks(getTasksDTO, user);
  }

  async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDTO, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: {
        userId: user.id,
        id,
      },
    });

    if (!task) {
      throw new NotFoundException(`task with ID: ${id} not found`);
    }

    return task;
  }

  async deleteTaskById(id: number, user: User): Promise<void> {
    const task = await this.getTaskById(id, user);

    await this.taskRepository.delete({ id: task.id, userId: user.id });
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;

    await this.taskRepository.save(task);

    return task;
  }
}
