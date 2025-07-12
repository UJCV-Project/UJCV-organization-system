import { Injectable } from '@nestjs/common';
import { CreateAcademicPeriodDto } from './dto/create-academic-period.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { envs } from 'src/config';

@Injectable()
export class AcademicPeriodService {
  constructor(private readonly prisma: PrismaService) { }

  async create(academicPeriodDatesDto: CreateAcademicPeriodDto) {
    const [lastAcademicPeriod] = await this.prisma.academicPeriod.findMany({
      orderBy: { startDate: 'desc' },
      take: 1,
    });

    const newAcademicPeriod = this.defineAcademicPeriod(academicPeriodDatesDto, lastAcademicPeriod);

    return this.prisma.academicPeriod.create({
      data: newAcademicPeriod,
    });
  }

  private defineAcademicPeriod(dto: CreateAcademicPeriodDto, lastPeriod: any) {
    let year = 2025;
    let period = 1;

    if (lastPeriod) {
      const isLastPeriodFinal = lastPeriod.period === 3;

      year = isLastPeriodFinal ? lastPeriod.year + 1 : lastPeriod.year;
      period = isLastPeriodFinal ? 1 : lastPeriod.period + 1;
    }

    return {
      year,
      period,
      startDate: dto.startDate,
      endDate: dto.endDate,
    };
  }

  async getList() {
    const academicPeriodList = await this.prisma.academicPeriod.findMany({
      select: {
        id: true,
        year: true,
        period: true,
      },
      orderBy: { startDate: 'desc' },
    });

    const formattedList = academicPeriodList.map(({ id, year, period }) => ({
      id,
      text: `${year}-${period}`,
    }));

    return { data: formattedList };
  }

  async getCurrent() {
    const currentDate = new Date();

    const currentAcademicPeriod = await this.prisma.academicPeriod.findFirst({
      where: {
        AND: [
          { startDate: { lte: currentDate } },
          { endDate: { gte: currentDate } },
        ],
      },
      take: 1,
    });

    return { data: currentAcademicPeriod };
  }

    async getById(id: string) {
    const academicPeriod = await this.prisma.academicPeriod.findFirst({
      where: {
        id
      },
      take: 1,
    });
    return { data: academicPeriod };
  }

}
