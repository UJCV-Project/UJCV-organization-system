import { Module } from '@nestjs/common';

import { CourseModule } from './course/course.module';
import { PrismaService } from './prisma/prisma.service';
import { CurriculumModule } from './curriculum/curriculum.module';
// import { CurriculumSubjectService } from './curriculum-subject/curriculum-subject.service';
// import { CurriculumSubjectModule } from './curriculum-subject/curriculum-subject.module';
import { DegreeModule } from './degree/degree.module';

@Module({
  imports: [CourseModule, CurriculumModule, DegreeModule],
  providers: [PrismaService],
})
export class AppModule {}
