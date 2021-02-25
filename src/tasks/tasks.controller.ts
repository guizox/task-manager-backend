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
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDTO } from './dto/create-task-dto';
import { GetTasksFitlerDTO } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/tasks-status-valitation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksServices: TasksService) { }

  @Get()
  getTasks(
    @Query(ValidationPipe) filterDTO: GetTasksFitlerDTO,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return this.tasksServices.getTasks(filterDTO, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDTO: CreateTaskDTO,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksServices.createTask(createTaskDTO, user);
  }

  @Get('/:id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Task> {
    console.log(user);
    return this.tasksServices.getTaskById(id, user);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.tasksServices.deleteTaskById(id, user);
  }

  @Patch('/:id')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User,
  ) {
    return this.tasksServices.updateTaskStatus(id, status, user);
  }
}
