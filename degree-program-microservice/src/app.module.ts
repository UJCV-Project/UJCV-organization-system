import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourseModule } from './course/course.module';
import { PrismaService } from './prisma/prisma.service';
import { CurriculumModule } from './curriculum/curriculum.module';

@Module({
  imports: [CourseModule, CurriculumModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
