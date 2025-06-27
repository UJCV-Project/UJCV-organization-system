import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RoomModule } from 'src/room/room.module';
import { AcademicPeriodModule } from 'src/academic-period/academic-period.module';
import { CourseModule } from 'src/course/course.module';
import { ProfessorModule } from 'src/professor/professor.module';

@Module({
  imports: [PrismaModule, RoomModule, AcademicPeriodModule, CourseModule, ProfessorModule],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule { }
