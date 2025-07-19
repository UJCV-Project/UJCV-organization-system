import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Res,
  ParseEnumPipe,
  Delete,
  Param,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiQuery } from '@nestjs/swagger';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { GetScheduleDto } from './dto/get-schedule.dto';
import { GROUP_BY } from './enums/groupBy.enum';
import { exportScheduleGridToExcel } from './schedule-excel';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}
  
  @Post()
  createSchedule(@Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.create(createScheduleDto);
  }

  @Get()
  async getSchedules(@Query() getScheduleDto: GetScheduleDto) {
    return this.scheduleService.getSchedules(getScheduleDto);
  }

  @Get('events/now')
  async getCurrentEvents(@Query() getScheduleDto: GetScheduleDto) {
    return this.scheduleService.getCurrentEvents();
  }

  @ApiQuery({ name: 'groupBy', enum: GROUP_BY })
  //!This needs a review
  @Get('groups')
  async getGroupedSchedules(
    @Query('groupBy', new ParseEnumPipe(GROUP_BY)) groupBy: GROUP_BY,
    @Query() getScheduleDto: GetScheduleDto,
  ) {
    return this.scheduleService.groupBy(groupBy, getScheduleDto);
  }

  @Delete(':scheduleId')
  async deleteSchedule(@Param('scheduleId') id: string) {
    return await this.scheduleService.deleteSchedule(id);
  }

  //!This needs a review
  @Delete(':scheduleId/events/:eventId')
  async deleteEvent(@Param('id') id: string) {
    return await this.scheduleService.deleteEvent(id);
  }


  //?Maybe to change this as a POST
  @Get('export')
  async export(@Res() res: Response, @Query() getScheduleDto: GetScheduleDto,) {
    const filename = "horario.xlsx"
    const { data } = await this.scheduleService.groupBy(
      GROUP_BY.ROOM,
      getScheduleDto,
    );
    
    const excelBuffer = await exportScheduleGridToExcel(data);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${filename}"`,
    );
    res.send(excelBuffer);
  }
  
}
