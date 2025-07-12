import { Module } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { ProfessorController } from './professor.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [ProfessorController],
  providers: [ProfessorService],
  exports:[ProfessorService]
})
export class ProfessorModule {}
