import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ScheduleService } from '../schedule/schedule.service';
import { CreateScheduleDiscussionDto } from './dto/create-discussion.dto';

@Injectable()
export class ScheduleDiscussionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scheduleService: ScheduleService,
  ) { }


  createMessage(scheduleId: string, createDiscussionDto: CreateScheduleDiscussionDto) {

  }


  findDiscussion(scheduleId: string) {

  }

}
