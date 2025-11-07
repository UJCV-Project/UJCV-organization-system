import { Module } from '@nestjs/common';
import { ScheduleDiscussionService } from './schedule-discussion.service';
import { ScheduleDiscussionController } from './schedule-discussion.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { AcademicPeriodModule } from 'src/app/academic-period/academic-period.module';
import { ScheduleModule } from '../schedule/schedule.module';

@Module({
  imports: [PrismaModule, AcademicPeriodModule, ScheduleModule],
  controllers: [ScheduleDiscussionController],
  providers: [ScheduleDiscussionService],
  exports: [ScheduleDiscussionService],
})
export class ScheduleDiscussionModule { }
