import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { ScheduleModule } from '../schedule-ms/schedule/schedule.module';

@Module({
  imports:[PrismaModule,ScheduleModule],
  controllers: [RoomController],
  providers: [RoomService],
  exports:[RoomService]
})
export class RoomModule {}
