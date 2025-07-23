import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { GetScheduleDto } from './dto/get-schedule.dto';
import { AcademicPeriodService } from 'src/app/academic-period/academic-period.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { GROUP_BY } from './enums/groupBy.enum';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly academicPeriodService: AcademicPeriodService,
  ) {}

  logger = new Logger('Schedule Service');
  async create(createDto: CreateScheduleDto) {
    const { academicPeriodId, professorId, roomId, courseId, section, events } =
      createDto;

    for (const event of events) {
      const orConditions: any[] = [];

      // Always check professor conflict
      orConditions.push({
        schedule: {
          academicPeriodId,
          professorId,
        },
      });

      //! Check room conflict only if not VIRTUAL
      //! ABSOLUTAMENTE BORRAR ESTO DESPUÉS
      if (roomId !== '85fd59d4-51cb-4f04-81d9-10ca22c0cfd3') {
        orConditions.push({
          schedule: {
            academicPeriodId,
            roomId,
          },
        });
      }

      const overlappingEvents = await this.prisma.event.findMany({
        where: {
          day: event.day,
          AND: [
            { startTime: { lt: event.endTime } },
            { endTime: { gt: event.startTime } },
          ],
          OR: orConditions,
        },
        include: { schedule: true },
      });

      if (overlappingEvents.length > 0) {
        const conflict = overlappingEvents[0];
        const isProfessorConflict =
          conflict.schedule.professorId === professorId;
        const conflictType = isProfessorConflict ? 'professor' : 'room';

        throw new BadRequestException(
          `Scheduling conflict: The ${conflictType} is already assigned on day ${event.day} from ${conflict.startTime} to ${conflict.endTime}.`,
        );
      }
    }

    // Insert schedule and events atomically
    return this.prisma.schedule.create({
      data: {
        academicPeriodId,
        professorId,
        courseId,
        roomId,
        section,
        events: {
          create: events,
        },
      },
      include: { events: true },
    });
  }

  async getSchedules(query: GetScheduleDto) {
    const academicPeriod = query.academicPeriodId
      ? await this.academicPeriodService.getPeriodById(query.academicPeriodId)
      : await this.academicPeriodService.getCurrent();

    const academicPeriodId = academicPeriod.data?.id;

    const rawEvents = await this.prisma.event.findMany({
      where: {
        schedule: {
          academicPeriodId,
          ...(query.professorId && { professorId: query.professorId }),
          ...(query.roomId && { roomId: query.roomId }),
          ...(query.courseId && { courseId: query.courseId }),
        },
      },
      orderBy: [{ startTime: 'asc' }, { endTime: 'asc' }],
      include: {
        schedule: {
          include: {
            room: { select: { name: true } },
            professor: {
              select: { id: true, firstName: true, lastName: true },
            },
            course: { select: { code: true, name: true } },
          },
        },
      },
    });

    const events = rawEvents.map((event) => ({
      id: event.id,
      day: event.day,
      startTime: event.startTime,
      endTime: event.endTime,
      scheduleId: event.scheduleId,
      courseId: event.schedule.courseId,
      courseCode: event.schedule.course.code,
      courseName: event.schedule.course.name,
      section: event.schedule.section,
      professorId: event.schedule.professorId,
      professorName: `${event.schedule.professor.firstName} ${event.schedule.professor.lastName}`,
      roomId: event.schedule.roomId,
      roomCode: event.schedule.room.name,
    }));

    return { data: { academicPeriod: academicPeriod.data, events } };
  }

  async groupBy(groupBy: GROUP_BY, query: GetScheduleDto) {
    const schedule = (await this.getSchedules(query)).data;
    const { events, academicPeriod } = schedule;

    const grouped = events.reduce(
      (acc, event) => {
        const key = event[groupBy];
        if (!key) return acc;

        if (!acc[key]) {
          acc[key] = [];
        }

        acc[key].push(event);
        return acc;
      },
      {} as Record<string, typeof events>,
    );

    return { data: { academicPeriod: { ...academicPeriod, events: grouped } } };
  }

  async getCurrentEvents(){
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 100 + now.getMinutes();

    const currentSchedule = (await this.getSchedules({})).data;

    const currentEvents: Array<any> = currentSchedule.events.filter((event) => {
      return (
        event.day === currentDay &&
        event.startTime <= currentTime &&
        currentTime < event.endTime
      );
    });

    return {data: currentEvents};
  }

  async deleteSchedule(id: string) {
    await this.prisma.event.deleteMany({
      where: { scheduleId: id },
    });

    const deletedSchedule = await this.prisma.schedule.delete({
      where: { id },
    });

    return deletedSchedule;
  }

  async deleteEvent(id: string) {
    const deletedEvent = await this.prisma.event.delete({
      where: { id },
    });

    return deletedEvent;
  }

}
