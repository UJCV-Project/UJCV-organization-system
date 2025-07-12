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
  private readonly logger = new Logger(ScheduleController.name);

  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  createSchedule(@Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.create(createScheduleDto);
  }

  @Get()
  async getSchedules(@Query() getScheduleDto: GetScheduleDto) {
    return this.scheduleService.getSchedules(getScheduleDto);
  }


  @ApiQuery({ name: 'groupBy', enum: GROUP_BY })
  @Get('group')
  async getGroupedSchedules(
    @Query('groupBy', new ParseEnumPipe(GROUP_BY)) groupBy: GROUP_BY,
    @Query() getScheduleDto: GetScheduleDto,
  ) {
    return this.scheduleService.getScheduleGroupedBy(groupBy, getScheduleDto);
  }

  @Get('export')
  async exportSchedulesToExcel(@Res() res: Response): Promise<void> {
    const { data } = await this.scheduleService.getScheduleGroupedBy(
      GROUP_BY.ROOM,
      {},
    );
    const excelBuffer = await exportScheduleGridToExcel(data);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="schedule.xlsx"',
    );
    res.send(excelBuffer);
  }

  @Get('initial-data')
  async getInitialData() {
    this.logger.log('Fetching initial schedule data');
    return this.scheduleService.getInitialData();
  }
  @ApiParam({ name: 'id' })
  @Delete('id/:id')
  async deleteSchedule(@Param('id') id: string) {
    return await this.scheduleService.deleteSchedule(id);
  }
  @ApiParam({ name: 'id' })
  @Delete('event/:id')
  async deleteEvent(@Param('id') id: string) {
    return await this.scheduleService.deleteEvent(id);
  }
}
