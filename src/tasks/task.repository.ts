import { TaskEntity } from './task.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task-dto';
import { TaskStatus } from './task.model';
import { GetTasksFitlerDTO } from './dto/get-tasks-filter.dto';

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {
  async createTask(createTaskDTO: CreateTaskDTO): Promise<TaskEntity> {
    const task = new TaskEntity();
    task.title = createTaskDTO.title;
    task.description = createTaskDTO.description;
    task.status = TaskStatus.OPEN;
    await task.save();

    return task;
  }

  async getTasks(getTasksFilterDTO: GetTasksFitlerDTO): Promise<TaskEntity[]> {
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

    const tasks = await query.getMany();
    return tasks;
  }
}
