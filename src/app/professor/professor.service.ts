import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateProfessorDto, GetProfessorDto, UpdateProfessorDto } from './dto';
import { ProfessorStatus } from './enums/professorStatus';
import { SelectOption } from 'src/common/types/select-option';
import { ProfessorActivity } from './enums/professorActivity';
import { formatTime } from 'src/common/utils/time-format';
import { days } from 'src/common/utils/days';
import { ScheduleService } from '../schedule-ms/schedule/schedule.service';

@Injectable()
export class ProfessorService {
  constructor(
    private prisma: PrismaService,
    private schedule: ScheduleService,
  ) {}

  async create(data: CreateProfessorDto) {
    try {
      const result = await this.prisma.professor.create({ data });
      return result;
    } catch (error) {
      if (error.code === 'P2002') {
        const response = {
          message: `El campo ${error.meta.target[0]} está duplicado`,
          error: 'Campos Duplicados',
          statusCode: HttpStatus.CONFLICT,
        };
        throw new ConflictException({ response });
      }
    }
  }


  //! Name doesn't filter, not implemented yet
  async getProfessors(professorPagination: GetProfessorDto) {
    const {
      page = 1,
      limit = 10,
      activity,
      ...conditions
    } = professorPagination;

    let professorFilter: any = { ...conditions };

    if (activity) {
      const filteredIds = await this.filterProfessorActivity(activity);
      if (filteredIds.length > 0) {
        professorFilter.id = { in: filteredIds };
      } else {
        return {
          data: [],
          metadata: { total: 0, page, lastPage: 0 },
        };
      }
    }

    const total = await this.prisma.professor.count({ where: professorFilter });
    const lastPage = Math.ceil(total / limit);

    const rawData = await this.prisma.professor.findMany({
      where: professorFilter,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        schedule: {
          select: {
            id: true,
            section: true,
            course: { select: { name: true } },
            room: { select: { name: true, capacity: true } },
            events: {
              select: { day: true, startTime: true, endTime: true },
            },
          },
        },
        available: { select: { day: true, startTime: true, endTime: true } },
      },
    });

    const data = rawData.map((prof) => ({
      id: prof.id,
      name: `${prof.firstName} ${prof.lastName}`,
      email: prof.email,
      schedule: prof.schedule.map((s) => {
        const timeSlots = s.events.map((event) => {
          const day = days[event.day] ?? `Día ${event.day}`;
          const start = formatTime(event.startTime);
          const end = formatTime(event.endTime);
          return `${day} ${start} - ${end}`;
        });

        return {
          id: s.id,
          course_name: s.course.name,
          section: s.section,
          room_name: s.room.name,
          students: s.room.capacity, //!This currently is not students but rather capacity
          time_slots: timeSlots,
        };
      }),

      //TODO: Might want to check this later
      available: prof.available.map((slot) => ({
        day: days[slot.day] ?? `Día ${slot.day}`,
        start: formatTime(slot.startTime),
        end: formatTime(slot.endTime),
      })),
    }));

    return {
      data,
      metadata: { total, page, lastPage },
    };
  }

  async find(professorId: string) {
    const rawData = await this.prisma.professor.findUnique({
      where: { id: professorId },
      include: {
        schedule: {
          select: {
            id: true,
            section: true,
            course: { select: { name: true } },
            room: { select: { name: true, capacity: true } },
            events: {
              select: { day: true, startTime: true, endTime: true },
            },
          },
        },
        available: { select: { day: true, startTime: true, endTime: true } },
      },
    });

    if (rawData === null) {
      const response = {
        message: `No se ha encontrado ningún profesor con el código ${professorId}`,
        error: 'No hay registro',
        statusCode: HttpStatus.NOT_FOUND,
      };
      throw new NotFoundException({ response });
    }

    const data = {
      id: rawData.id,
      name: `${rawData.firstName} ${rawData.lastName}`,
      email: rawData.email,
      schedule: rawData.schedule.map((s) => {
        const timeSlots = s.events.map((event) => {
          const day = days[event.day] ?? `Día ${event.day}`;
          const start = formatTime(event.startTime);
          const end = formatTime(event.endTime);
          return `${day} ${start} - ${end}`;
        });

        return {
          id: s.id,
          course_name: s.course.name,
          section: s.section,
          room_name: s.room.name,
          students: s.room.capacity, //!This currently is not students but rather capacity
          time_slots: timeSlots,
        };
      }),

      //TODO: Might want to check this later
      available: rawData.available.map((slot) => ({
        day: days[slot.day] ?? `Día ${slot.day}`,
        start: formatTime(slot.startTime),
        end: formatTime(slot.endTime),
      })),
    };

    const result = { data };
    return result;
  }

  async selectOptions(): Promise<{ data: SelectOption[] }> {
    const rawProfessors = await this.prisma.professor.findMany({
      where: { status: ProfessorStatus.ACTIVO },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    const professors: SelectOption[] = rawProfessors.map((p) => ({
      value: p.id,
      label: `${p.firstName} ${p.lastName}`,
    }));

    return { data: professors };
  }

  async update(id: string, data: UpdateProfessorDto) {
    await this.find(id);
    try {
      const result = await this.prisma.professor.update({
        where: { id },
        data,
      });
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  delete(id: string) {
    this.find(id);
    return this.prisma.professor.update({
      where: { id },
      data: { status: ProfessorStatus.INACTIVO },
    });
  }

  async filterProfessorActivity(
    activity: ProfessorActivity,
  ): Promise<string[]> {
    const now = new Date();
    const day = now.getDay();
    const minutes = now.getHours() * 60 + now.getMinutes();

    const currentEvents = (await this.schedule.getCurrentEvents()).data;
    const teachingIds = new Set(currentEvents.map((e) => e.professorId));

    if (activity === ProfessorActivity.TEACHING) {
      return teachingIds.size === 0 ? []: [...teachingIds];
    }

    const availableNow = await this.prisma.professorAvailableSlots.findMany({
      where: {
        day,
        startTime: { lte: minutes },
        endTime: { gt: minutes },
      },
      select: { professorId: true },
    });

    const availableIds = new Set(availableNow.map((a) => a.professorId));

    if (activity === ProfessorActivity.AVAILABLE) {
      if(availableIds.size != 0){
      return [...availableIds].filter((id) => !teachingIds.has(id)) as Array<any>;
      }else{
        return [];
      }
    }

    if (activity === ProfessorActivity.UNAVAILABLE) {
      const allProfessors = await this.prisma.professor.findMany({
        select: { id: true },
        where: { id: { notIn: [...availableIds] } },
      });
      return allProfessors.map((p) => p.id);
    }

    return [];
  }
}
