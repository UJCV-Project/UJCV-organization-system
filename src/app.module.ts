import { Module } from '@nestjs/common';

import { CourseModule } from './course/course.module';
import { PrismaService } from './prisma/prisma.service';
import { DegreeModule } from './degree/degree.module';
import { CurriculumModule } from './curriculum/curriculum.module';
import { AcademicPeriodModule } from './academic-period/academic-period.module';
import { RoomModule } from './room/room.module';
import { ProfessorModule } from './professor/professor.module';
import { ScheduleModule } from './schedule/schedule.module';

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
