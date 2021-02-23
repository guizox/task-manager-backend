import { TaskStatus } from '../task.model';

export class GetTasksFitlerDTO {
  status: TaskStatus;
  search: string;
}
