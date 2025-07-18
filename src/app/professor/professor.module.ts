import { Module } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { ProfessorController } from './professor.controller';
import { PrismaModule } from 'src/utils/prisma/prisma.module';
import { ScheduleModule } from '../schedule/schedule.module';

@Module({
  imports:[PrismaModule, ScheduleModule],
  controllers: [ProfessorController],
  providers: [ProfessorService],
  exports:[ProfessorService]
})
export class ProfessorModule {}
