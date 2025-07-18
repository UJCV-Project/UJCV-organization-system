import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { PrismaModule } from 'src/utils/prisma/prisma.module';
import { AcademicPeriodModule } from 'src/app/academic-period/academic-period.module';

@Module({
  imports: [PrismaModule, AcademicPeriodModule ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports:[ScheduleService],
})
export class ScheduleModule { }
