import { Module } from '@nestjs/common';

import { CourseModule } from './course/course.module';
import { PrismaService } from './prisma/prisma.service';
import { DegreeModule } from './degree/degree.module';

@Module({
  imports: [CourseModule, DegreeModule],
  providers: [PrismaService],
})
export class AppModule {}
