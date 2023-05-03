import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  /* private tasks: Task[] = [];

    getAllTasks(): Task[]{
        return this.tasks;
    }

    getTaskWithFilters(filterDto: GetTasksFilterDto): Task[]{
        const {status, search} = filterDto;
        let tasks = this.getAllTasks();
        if(status) {
            tasks = tasks.filter(task => task.status === status);
        }
        if(search) {
            tasks = tasks.filter(task => 
                task.title.includes(search) ||
                task.description.includes(search),
            );
        }
        return tasks;

    }

    getTaskById(id: string): Task{
        const found =  this.tasks.find(task => task.id === id);
        if(!found){
            throw new NotFoundException(`Task with ID "${id}" Not Found`)
        }

        return found;
    }

    createTask( createTaskDto: CreateTaskDto){
        const {title, description} = createTaskDto;
        const task: Task = {
            id: uuidv4(),
            title,
            description,
            status: TaskStatus.OPEN
        }
        this.tasks.push(task);
        return task;

    }

    deletTask(id: string){
        const found = this.getTaskById(id);
        this.tasks = this.tasks.filter(task => task.id !== found.id);
    }

    updateTaskStatus(id: string,status: TaskStatus ){
        const task = this.getTaskById(id);
        task.status = status;
        return task;
    } */

  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: {
        id,
      },
    });
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" Not Found`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    await task.save();

    return task;
  }

  async deletTask(id: number): Promise<void> {
    const found = await this.taskRepository.delete(id);
    if (found.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" Not Found`);
    }
    console.log(found);
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task;
  }

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.taskRepository.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere('(task.title LIKE :search OR Task.title LIKE :search)' , { search: `%${search}%` });
    }

    const tasks = await query.getMany();
    return tasks;
  }
}
