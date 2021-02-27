import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { CreateTaskDTO } from "./dto/create-task-dto";
import { GetTasksFitlerDTO } from "./dto/get-tasks-filter.dto";
import { TaskStatus } from "./task.model";
import { TaskRepository } from "./task.repository";
import { TasksService } from "./tasks.service";

const mockUser = { username: "vitor" };

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
});

describe("Tasks Services", () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  it("getTasks", async () => {
    taskRepository.getTasks.mockResolvedValue("some value");

    expect(taskRepository.getTasks).not.toHaveBeenCalled();
    const filterDTO: GetTasksFitlerDTO = {
      search: "",
      status: TaskStatus.OPEN,
    };

    const result = await tasksService.getTasks(filterDTO, mockUser);

    expect(result).toEqual("some value");
  });

  describe("getTaskById", () => {
    it("finding a valid id", async () => {
      const mockResult = {
        title: "teste",
        description: "teste desc",
      };

      taskRepository.findOne.mockResolvedValue(mockResult);

      expect(taskRepository.findOne).not.toHaveBeenCalled();

      const result = await tasksService.getTaskById(1, mockUser);

      expect(result).toEqual(mockResult);
    });

    it("throwning an error", async () => {
      taskRepository.findOne.mockResolvedValue(null);

      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  it("createTask", async () => {
    const createTaskDTO: CreateTaskDTO = {
      description: "teste",
      title: "title test",
    };

    taskRepository.createTask.mockResolvedValue("teste");

    expect(taskRepository.createTask).not.toHaveBeenCalled();
    const result = await tasksService.createTask(createTaskDTO, mockUser);

    expect(taskRepository.createTask).toHaveBeenCalledWith(
      createTaskDTO,
      mockUser
    );

    expect(result).toEqual("teste");
  });
});
