import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.model';
import { CreateTaskDTO } from './dto/create-task-dto';
import { GetTasksFitlerDTO } from './dto/get-tasks-filter.dto';
import { TaskEntity } from './task.entity';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) { }

  async getTasks(getTasksDTO: GetTasksFitlerDTO): Promise<TaskEntity[]> {
    return await this.taskRepository.getTasks(getTasksDTO);
  }

  async createTask(createTaskDTO: CreateTaskDTO): Promise<TaskEntity> {
    return this.taskRepository.createTask(createTaskDTO);
  }

  async getTaskById(id: number): Promise<TaskEntity> {
    const task = await this.taskRepository.findOne(id);

    if (!task) {
      throw new NotFoundException(`task with ID: ${id} not found`);
    }

    return task;
  }

  async deleteTaskById(id: number): Promise<void> {
    const task = await this.getTaskById(id);

    await this.taskRepository.delete({ id: task.id });
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<TaskEntity> {
    const task = await this.getTaskById(id);
    task.status = status;

    await this.taskRepository.save(task);

    return task;
  }

}
