import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Logger,
  Res,
  ParseEnumPipe,
  Delete,
  Param,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiParam, ApiQuery } from '@nestjs/swagger';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { GetScheduleDto } from './dto/get-schedule.dto';
import { GROUP_BY } from './enums/groupBy.enum';
import { exportScheduleGridToExcel } from './schedule-excel';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}
  
  @Post()
  createSchedule(@Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.create(createScheduleDto);
  }

  @Get()
  async get(@Query() getScheduleDto: GetScheduleDto) {
    return this.scheduleService.get(getScheduleDto);
  }

  @ApiQuery({ name: 'groupBy', enum: GROUP_BY })
  @Get('group')
  async getGroupedSchedules(
    @Query('groupBy', new ParseEnumPipe(GROUP_BY)) groupBy: GROUP_BY,
    @Query() getScheduleDto: GetScheduleDto,
  ) {
    return this.scheduleService.groupBy(groupBy, getScheduleDto);
  }

  @Delete(':id')
  async deleteSchedule(@Param('id') id: string) {
    return await this.scheduleService.deleteSchedule(id);
  }

  @Delete('event/:id')
  async deleteEvent(@Param('id') id: string) {
    return await this.scheduleService.deleteEvent(id);
  }

  @Get('form-data')
  async getInitialData() {
    return this.scheduleService.getInitialData();
  }

  @Get('export')
  async export(@Res() res: Response, @Query() getScheduleDto: GetScheduleDto,): Promise<void> {
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
