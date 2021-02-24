import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task-dto';
import { GetTasksFitlerDTO } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/tasks-status-valitation.pipe';
import { TaskEntity } from './task.entity';
import { TaskStatus } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksServices: TasksService) { }

  @Get()
  getTasks(
    @Query(ValidationPipe) filterDTO: GetTasksFitlerDTO,
  ): Promise<TaskEntity[]> {
    return this.tasksServices.getTasks(filterDTO);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDTO: CreateTaskDTO): Promise<TaskEntity> {
    return this.tasksServices.createTask(createTaskDTO);
  }

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<TaskEntity> {
    return this.tasksServices.getTaskById(id);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id', ParseIntPipe) id: number) {
    return this.tasksServices.deleteTaskById(id);
  }

  @Patch('/:id')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ) {
    return this.tasksServices.updateTaskStatus(id, status);
  }
}
