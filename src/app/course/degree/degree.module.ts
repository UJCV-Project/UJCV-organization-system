import { Module } from '@nestjs/common';
import { DegreeService } from './degree.service';
import { DegreeController } from './degree.controller';
import { PrismaModule } from 'src/utils/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DegreeController],
  providers: [DegreeService],
})
export class DegreeModule {}
