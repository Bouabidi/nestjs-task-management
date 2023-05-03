import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { typeRomConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TasksModule, TypeOrmModule.forRoot(typeRomConfig)],
  controllers: [],
  providers: [],
})
export class AppModule {}
