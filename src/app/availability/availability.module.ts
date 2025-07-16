import { Module } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { ScheduleModule } from '../schedule/schedule.module';
import { RoomModule } from '../room/room.module';
import { AvailabilityController } from './availability.controller';
import { ProfessorModule } from '../professor/professor.module';

@Module({
  imports:[RoomModule,ScheduleModule,ProfessorModule],
  providers: [AvailabilityService],
  controllers: [AvailabilityController]
})
export class AvailabilityModule {}
