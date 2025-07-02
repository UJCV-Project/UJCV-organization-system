import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { GetScheduleDto } from './dto/get-schedule.dto';
import { RoomService } from 'src/room/room.service';
import { AcademicPeriodService } from 'src/academic-period/academic-period.service';
import { days } from 'src/common/days';
import { CourseService } from 'src/course/course.service';
import * as ExcelJS from 'exceljs';
import { ProfessorService } from 'src/professor/professor.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Sections } from 'src/common/sections';
import { GROUP_BY } from './enums/groupBy.enum';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly courseService: CourseService,
    private readonly professorService: ProfessorService,
    private readonly roomService: RoomService,
    private readonly academicPeriodService: AcademicPeriodService,
  ) {}

  logger = new Logger('Schedule Service');
async create(createDto: CreateScheduleDto) {
  const { academicPeriodId, professorId, roomId, courseId, section, events } = createDto;

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
      const isProfessorConflict = conflict.schedule.professorId === professorId;
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
      ? await this.academicPeriodService.getById(query.academicPeriodId)
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
            room: { select: { code: true } },
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
      roomCode: event.schedule.room.code,
    }));

    return { data: { academicPeriod: { ...academicPeriod.data, events } } };
  }

  async getScheduleGroupedBy(groupBy: GROUP_BY, query: GetScheduleDto) {
    const schedule = (await this.getSchedules(query)).data;
    const { events, ...academicPeriod } = schedule.academicPeriod;

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

  async getInitialData() {
    const professorsRes = await this.professorService.getListProfessor();
    const coursesRes = await this.courseService.listCourses();
    const roomsRes = await this.roomService.getRoomList();
    const sectionsRes = Object.entries(Sections).map(([key, value]) => ({
      id: key,
      text: value,
    }));
    const body = {
      professors: professorsRes.data,
      courses: coursesRes.data,
      rooms: roomsRes.data,
      sections: sectionsRes,
    };
    return body;
  }

  /*Maybe separate this logic*/

  async exportScheduleGridToExcel(data: any): Promise<Buffer> {
    const schedules: Record<string, any[]> = data.academicPeriod.events;
    const groupBy = 'Aula';
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(`Horario por ${groupBy}`);

    for (const [groupedBy, events] of Object.entries(schedules)) {
      sheet.addRows([[''], [groupedBy], ['Hora', ...days]]);

      const headerRowNumber = sheet.lastRow!.number;
      const headerRow = sheet.getRow(headerRowNumber);

      headerRow.eachCell((cell) => {
        cell.font = {
          name: 'Calibri',
          size: 11,
          color: { argb: 'FF121212' },
        };
        cell.alignment = { horizontal: 'center' };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE5E5E5' },
        };
      });

      this.generateScheduleTable(sheet, events);
    }
    this.mergeScheduleCells(sheet);

    // Adjust column widths
    sheet.getColumn(1).width = 12; // Time column
    for (let i = 2; i <= 8; i++) {
      sheet.getColumn(i).width = 30;
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  private generateScheduleTable(sheet: ExcelJS.Worksheet, events: any[]) {
    const timeSlots = this.generateTimeSlots(700, 2100, 100);
    const numColumns = 7;

    timeSlots.forEach((time, i) => {
      if (timeSlots[i + 1]) {
        let timeRow: string[] = new Array(numColumns).fill('');
        const label = `${this.formatTime(timeSlots[i])}-${this.formatTime(timeSlots[i + 1])}`;
        timeRow[0] = label;

        //Find the schedule for each cell
        events.forEach((event) => {
          const inRange = event.endTime > time && time >= event.startTime;
          if (inRange) {
            const col = event.day + 1;
            timeRow[col] =
              `${event.courseCode} ${event.courseName}\n${event.section}-C\n${event.professorName}`;
          }
        });

        const excelRow = sheet.addRow(timeRow);
        this.designScheduleTable(excelRow);
      }
    });
  }

  private designScheduleTable(excelRow: ExcelJS.Row) {
    excelRow.height = 40;
    excelRow.eachCell((cell, colNumber) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF3A6EA5' } },
        left: { style: 'thin', color: { argb: 'FF3A6EA5' } },
        bottom: { style: 'thin', color: { argb: 'FF3A6EA5' } },
        right: { style: 'thin', color: { argb: 'FF3A6EA5' } },
      };

      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      };

      // Header/label column style
      if (colNumber === 1) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFDEE9F7' }, // Light blue background
        };
        cell.font = {
          name: 'Calibri',
          size: 12,
          bold: true,
          color: { argb: '121212' }, // Dark blue text
        };
      } else {
        // Even columns subtle blue shade, odd columns white background
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {
            argb: colNumber % 2 === 0 ? 'FFF2F7FB' : 'FFFFFFFF', // very light blue vs white
          },
        };
        cell.font = {
          name: 'Calibri',
          size: 11,
          color: { argb: '121212' }, // Medium blue text
        };
      }
    });
  }

  private mergeScheduleCells(sheet: ExcelJS.Worksheet) {
    const totalRows = sheet.rowCount;
    const totalCols = sheet.columnCount;

    for (let col = 1; col <= totalCols; col++) {
      let mergeStart = 1;

      for (let row = 2; row <= totalRows + 1; row++) {
        const currentCell = sheet.getCell(row, col).value;
        const previousCell = sheet.getCell(row - 1, col).value;

        if (
          currentCell === previousCell &&
          currentCell !== '' &&
          currentCell !== null
        ) {
        } else {
          if (row - 1 > mergeStart) {
            sheet.mergeCells(mergeStart, col, row - 1, col);
          }
          mergeStart = row;
        }
      }
    }
  }

  private generateTimeSlots(
    start: number,
    end: number,
    step: number,
  ): number[] {
    const slots: number[] = [];
    for (let time = start; time <= end; time += step) {
      slots.push(time);
    }
    return slots;
  }

  private formatTime(time: number): string {
    const hours = Math.floor(time / 100);
    const minutes = time % 100;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
}
