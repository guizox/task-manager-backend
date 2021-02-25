import { Task } from './task.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task-dto';
import { TaskStatus } from './task.model';
import { GetTasksFitlerDTO } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    const task = new Task();
    task.title = createTaskDTO.title;
    task.description = createTaskDTO.description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    await task.save();
    delete task.user;

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

    const tasks = await query.getMany();
    return tasks;
  }
}
