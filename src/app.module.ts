import { Module } from '@nestjs/common';

import { CourseModule } from './app/course/course.module';
import { PrismaService } from './prisma/prisma.service';
import { DegreeModule } from './app/degree/degree.module';
import { CurriculumModule } from './app/curriculum/curriculum.module';
import { AcademicPeriodModule } from './app/academic-period/academic-period.module';
import { RoomModule } from './app/room/room.module';
import { ProfessorModule } from './app/professor/professor.module';
import { ScheduleModule } from './app/schedule/schedule.module';

@Module({
  imports: [
    CourseModule,
    DegreeModule,
    CurriculumModule,
    AcademicPeriodModule,
    RoomModule,
    ProfessorModule,
    ScheduleModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
