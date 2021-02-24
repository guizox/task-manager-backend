import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v1 as uuid } from 'uuid';
import { CreateTaskDTO } from './dto/create-task-dto';
import { GetTasksFitlerDTO } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks = (): Task[] => {
    return this.tasks;
  };

  createService(createTaskDTO: CreateTaskDTO) {
    const task = {
      ...createTaskDTO,
      status: TaskStatus.OPEN,
      id: uuid(),
    };

    this.tasks.push(task);
    return task;
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find((item) => item.id === id);

    if (!task) {
      throw new NotFoundException(`task with ID: ${id} not found`);
    }

    return task;
  }

  deleteTaskById(id: string): void {
    const task = this.getTaskById(id);
    this.tasks = this.tasks.filter((item) => item.id !== task.id);
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = status;

    return task;
  }

  getTasksWithFilter(filterDTO: GetTasksFitlerDTO): Task[] {
    const { status, search } = filterDTO;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((item) => item.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        (item) =>
          item.title.includes(search) || item.description.includes(search),
      );
    }

    return tasks;
  }
}
