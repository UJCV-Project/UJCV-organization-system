import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { PrismaModule } from 'src/utils/prisma/prisma.module';
import { RoomModule } from 'src/app/room/room.module';
import { AcademicPeriodModule } from 'src/app/academic-period/academic-period.module';
import { CourseModule } from 'src/app/course/course.module';
import { ProfessorModule } from 'src/app/professor/professor.module';

@Module({
  imports: [PrismaModule, RoomModule, AcademicPeriodModule, CourseModule, ProfessorModule],
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports:[ScheduleService],
})
export class ScheduleModule { }
