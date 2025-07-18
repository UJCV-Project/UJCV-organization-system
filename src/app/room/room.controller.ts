import { Controller, Get, Post, Body } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @Get('options')
  selectOptions() {
    return this.roomService.selectOptions();
  }

  @Get('available')
  getAvailableRooms(){
    return this.roomService.getAvailableRooms();
  }
}
