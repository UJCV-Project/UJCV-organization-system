import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}
  
  async create(createRoomDto: CreateRoomDto) {
    const savedRoom = await this.prisma.room.create({data:createRoomDto})
    return savedRoom;
  }

  async getRoomList() {
    const roomList = await this.prisma.room.findMany({orderBy:{code:'asc'}})
    const formattedList = roomList.map(({ id, code }) => ({
      id,
      text: code,
    }));
    return {data:formattedList}
  }
}
