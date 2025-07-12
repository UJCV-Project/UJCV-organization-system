import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SelectOption } from 'src/common/select-option';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}
  
  async create(createRoomDto: CreateRoomDto) {
    const savedRoom = await this.prisma.room.create({data:createRoomDto})
    return savedRoom;
  }

  async selectOptions(): Promise<{data: SelectOption[]}> {
    const roomList = await this.prisma.room.findMany({orderBy:{code:'asc'}})
    const formattedList: SelectOption[] = roomList.map(({ id, code }) => ({
      value: id,
      label: code,
    }));
    return {data:formattedList};
  }
}
