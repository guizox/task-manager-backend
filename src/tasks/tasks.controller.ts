import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task-dto';
import { GetTasksFitlerDTO } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/tasks-status-valitation.pipe';
import { Task, TaskStatus } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksServices: TasksService) { }

  @Get()
  getTasks(@Query(ValidationPipe) filterDTO: GetTasksFitlerDTO): Task[] {
    if (Object.keys(filterDTO).length) {
      return this.tasksServices.getTasksWithFilter(filterDTO);
    }
    return this.tasksServices.getAllTasks();
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDTO: CreateTaskDTO): Task {
    return this.tasksServices.createService(createTaskDTO);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksServices.getTaskById(id);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id: string) {
    return this.tasksServices.deleteTaskById(id);
  }

  @Patch('/:id')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ) {
    return this.tasksServices.updateTaskStatus(id, status);
  }
}
