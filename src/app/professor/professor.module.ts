import { Module } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { ProfessorController } from './professor.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { ScheduleModule } from '../schedule-ms/schedule/schedule.module';

@Module({
  imports:[PrismaModule, ScheduleModule],
  controllers: [ProfessorController],
  providers: [ProfessorService],
  exports:[ProfessorService]
})
export class ProfessorModule {}
