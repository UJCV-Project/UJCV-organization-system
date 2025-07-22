import { Module } from '@nestjs/common';

import { PrismaService } from './utils/prisma/prisma.service';


import { CourseModule } from './app/course/course.module';
import { DegreeModule } from './app/course/degree/degree.module';
import { CurriculumModule } from './app/course/curriculum/curriculum.module';
import { AcademicPeriodModule } from './app/academic-period/academic-period.module';
import { RoomModule } from './app/room/room.module';
import { ProfessorModule } from './app/professor/professor.module';
import { ScheduleModule } from './app/schedule/schedule.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    CourseModule,
    DegreeModule,
    CurriculumModule,
    AcademicPeriodModule,
    RoomModule,
    ProfessorModule,
    ScheduleModule,
    AuthModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
