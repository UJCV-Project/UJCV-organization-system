import { Injectable, NotImplementedException } from '@nestjs/common';
import { RoomService } from '../room/room.service';
import { ScheduleService } from '../schedule/schedule.service';
import { ProfessorService } from '../professor/professor.service';

@Injectable()
export class AvailabilityService {
  constructor(
    private readonly roomService: RoomService,
    private readonly scheduleService: ScheduleService,
    private readonly professorService: ProfessorService,
  ) {}

  async findRooms() {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 100 + now.getMinutes();

    const currentSchedule = (await this.scheduleService.get({})).data;

    // Get only events that conflict with current time
    const busyEvents = currentSchedule.events.filter((event) => {
      return (
        event.day === currentDay &&
        event.startTime <= currentTime &&
        currentTime < event.endTime
      );
    });

    // Get a Set of busy roomIds
    const busyRoomIds = new Set(busyEvents.map((event) => event.roomId));

    const allRooms = await this.roomService.get();
    const availableRooms = allRooms.filter((room) => !busyRoomIds.has(room.id));   

    return {data: availableRooms};
  }

  findProfessors() {
    return new NotImplementedException();
  }
}
