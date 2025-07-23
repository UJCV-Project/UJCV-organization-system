import { Injectable } from '@nestjs/common';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { DeleteCurriculumDto } from './dto/delete-curriculum.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class CurriculumService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createCurriculumDto: CreateCurriculumDto) {
    const { degreeId, courseId, semester } = createCurriculumDto;
    return this.prisma.curriculum.create({
      data: {
        degreeId,
        courseId,
        semester,
      },
    });
  }

  async findDegreeCoursesBySemester(degreeId: string) {
    const curriculumData = await this.prisma.curriculum.findMany({
      include: {course: true},
      where: { degreeId },
      orderBy: {semester: 'asc',},
    });


    const grouped = curriculumData.reduce((acc, item) => {
      const semester = item.semester || 0;

      if (!acc[semester]) {
        acc[semester] = [];
      }

      acc[semester].push({
        ...item.course,
      });

      return acc;
    }, {} as Record<number, any[]>);

    return Object.entries(grouped).map(([semester, courses]) => ({
      semester: Number(semester),
      courses,
    }));
  }

  async remove(deleteCurriculumDto: DeleteCurriculumDto) {
    const { degreeId, courseId } = deleteCurriculumDto;
    return this.prisma.curriculum.delete({
      where: {
        degreeId_courseId: {
          degreeId,
          courseId,
        },
      },
    });
  }
}
