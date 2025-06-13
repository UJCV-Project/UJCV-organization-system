import { Module } from '@nestjs/common';

import { CourseModule } from './course/course.module';
import { PrismaService } from './prisma/prisma.service';
import { DegreeModule } from './degree/degree.module';
import { CurriculumModule } from './curriculum/curriculum.module';

@Module({
  imports: [CourseModule, DegreeModule, CurriculumModule],
  providers: [PrismaService],
})
export class AppModule {}
