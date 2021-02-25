import { Task } from './task.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task-dto';
import { TaskStatus } from './task.model';
import { GetTasksFitlerDTO } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('taskRepository');

  async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    const task = new Task();
    task.title = createTaskDTO.title;
    task.description = createTaskDTO.description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    try {
      await task.save();
      delete task.user;
    } catch (e) {
      this.logger.error(
        `Failed to get tasks for user "${user.username}", DTO: ${JSON.stringify(
          createTaskDTO,
        )}`,
        e.stack,
      );
    }

    return task;
  }

  async getTasks(
    getTasksFilterDTO: GetTasksFitlerDTO,
    user: User,
  ): Promise<Task[]> {
    const { status, search } = getTasksFilterDTO;

    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        {
          search: `%${search}%`,
        },
      );
    }

    query.andWhere('task.userId = :userId', { userId: user.id });

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (e) {
      this.logger.error(
        `Failed to get tasks for user "${user.username}", DTO: ${JSON.stringify(
          getTasksFilterDTO,
        )}`,
        e.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
