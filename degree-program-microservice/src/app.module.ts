import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourseModule } from './course/course.module';
import { CurriculumModule } from './curriculum/curriculum.module';

@Module({
  imports: [CourseModule, CurriculumModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
