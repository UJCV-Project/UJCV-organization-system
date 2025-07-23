import { Module } from '@nestjs/common';

import { PrismaService } from './common/prisma/prisma.service';


import { DegreeModule } from './app/course-ms/degree/degree.module';
import { CurriculumModule } from './app/course-ms/curriculum/curriculum.module';
import { AcademicPeriodModule } from './app/academic-period/academic-period.module';
import { RoomModule } from './app/room/room.module';
import { ProfessorModule } from './app/professor/professor.module';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './app/course-ms/course/course.module';
import { ScheduleModule } from './app/schedule-ms/schedule/schedule.module';
import { ScheduleDiscussionModule } from './app/schedule-ms/schedule-discussion/schedule-discussion.module';

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
    ScheduleDiscussionModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
