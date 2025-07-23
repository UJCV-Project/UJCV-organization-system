import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ScheduleDiscussionService } from './schedule-discussion.service';
import { CreateScheduleDiscussionDto } from './dto/create-discussion.dto';

@Controller('schedule-discussion')
export class ScheduleDiscussionController {
  constructor(private readonly scheduleDiscussionService: ScheduleDiscussionService) { }

  @Post(':scheduleId')
  createMessage(
    @Param('scheduleId') scheduleId: string,
    @Body() createDiscussionDto: CreateScheduleDiscussionDto) {
    return this.scheduleDiscussionService.createMessage(scheduleId, createDiscussionDto);
  }

  @Get(':scheduleId')
  findDiscussion(
    @Param('scheduleId') scheduleId: string,
  ) {
    return this.scheduleDiscussionService.findDiscussion(scheduleId);
  }
}
