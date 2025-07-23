import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseStatus } from './enum/course-status';
import { CoursePaginationDto } from './dto/get-course.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}
  logger = new Logger('Course Service');

  async create(createCourseDto: CreateCourseDto) {
    const code = createCourseDto.code;
    const existingCourse = await this.prisma.course.findUnique({
      where: { code },
    });

    if (existingCourse?.status === CourseStatus.activo) {
      throw new ConflictException(`Ya existe una clase con el código: ${code}`);
    }

    const course = await this.prisma.course.upsert({
      where: { code },
      update: createCourseDto,
      create: createCourseDto,
    });

    return course;
  }

  async findAll(coursePagination: CoursePaginationDto) {
    const { page = 1, limit = 10, ...conditions } = coursePagination;

    const whereConditions: any = {
      code: {
        contains: conditions.code,
        mode: 'insensitive',
      },
      name: {
        contains: conditions.name,
        mode: 'insensitive',
      },
      ...(conditions.degreeId && { degreeId: conditions.degreeId }),
      ...(conditions.status && { status: conditions.status }),
    };

    const totalPages = await this.prisma.course.count({
      where: whereConditions,
    });
    const lastPage = Math.ceil(totalPages / limit);

    const rawData = await this.prisma.course.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: whereConditions,
      select: {
        // Select all course fields
        id: true,
        name: true,
        code: true,
        unitValue: true,
        status: true,
        curriculum: {
          select: {
            degree: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const data = rawData.map((course) => {
      // Extract degree names from curriculum array
      const careers = course.curriculum.map((c) => c.degree.name);

      return {
        ...course,
        careers,
        curriculum: undefined, // optionally remove original curriculum
      };
    });

    return {
      data: data,
      metadata: {
        total: totalPages,
        page: page,
        lastPage: lastPage,
      },
    };
  }

  async findById(id: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) {
      throw new NotFoundException(
        `No se encontro un programa de grado con este identificador`,
      );
    }
    return { data: course };
  }

  async selectOptions() {
    const listCourses = await this.prisma.course.findMany({
      where: { status: CourseStatus.activo },
      select: {
        id: true,
        code: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    });

    const result = listCourses.map((course) => ({
      value: course.id,
      label: `${course.code} | ${course.name}`,
    }));

    return { data: result };
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    await this.findById(id);

    try {
      return await this.prisma.course.update({
        where: { id },
        data: updateCourseDto,
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException(`El codigo de clase ya existe`);
      }
    }
  }

  async delete(id: string) {
    await this.findById(id);
    return await this.prisma.course.update({
      where: { id },
      data: { status: CourseStatus.inactivo },
    });
  }
}
