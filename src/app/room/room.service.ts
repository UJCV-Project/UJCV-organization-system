import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { SelectOption } from 'src/common/types/select-option';
import { ScheduleService } from '../schedule/schedule.service';

@Injectable()
export class RoomService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scheduleService: ScheduleService,
  ) {}

  async create(createRoomDto: CreateRoomDto) {
    const savedRoom = await this.prisma.room.create({ data: createRoomDto });
    return savedRoom;
  }

  async get() {
    const result = await this.prisma.room.findMany({
      where: {
        room_type: {
          not: 'Virtual',
        },
      },
      orderBy: { name: 'asc' },
    });
    return result;
  }

  async selectOptions(): Promise<{ data: SelectOption[] }> {
    const roomList = await this.prisma.room.findMany({
      orderBy: { name: 'asc' },
    });
    const formattedList: SelectOption[] = roomList.map(({ id, name }) => ({
      value: id,
      label: name,
    }));
    return { data: formattedList };
  }

  async getAvailableRooms() {
    const currentEvents = (await this.scheduleService.getCurrentEvents()).data;
    const busyRoomsId = new Set(
      currentEvents.map((event) => event.roomId),
    );
    const allRooms = await this.prisma.room.findMany({});
    const availableRooms = allRooms.filter(
      (room) => !busyRoomsId.has(room.id),
    );

    return { data: availableRooms };
  }
}
