import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Task } from 'src/tasks/task.entity';

export const typeRomConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'taskmanagment',
  entities: [Task],
  synchronize: true,
};
