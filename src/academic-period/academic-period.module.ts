import { Module } from '@nestjs/common';
import { AcademicPeriodService } from './academic-period.service';
import { AcademicPeriodController } from './academic-period.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [AcademicPeriodController],
  providers: [AcademicPeriodService],
  exports:[AcademicPeriodService],
})
export class AcademicPeriodModule {}
