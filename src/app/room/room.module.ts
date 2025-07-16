import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { PrismaModule } from 'src/utils/prisma/prisma.module';
import { ScheduleModule } from '../schedule/schedule.module';

@Module({
  imports:[PrismaModule],
  controllers: [RoomController],
  providers: [RoomService],
  exports:[RoomService]
})
export class RoomModule {}
