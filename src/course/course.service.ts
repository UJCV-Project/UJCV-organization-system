import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Prisma } from '@prisma/client';
import { CourseStatus } from './enum/course-status';
import { CoursePaginationDto } from './dto/get-course.dto';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto) {
    const code = createCourseDto.code;
    const existingCourse= await this.prisma.course.findUnique({where:{code}});

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
      degreeId: {
        contains: conditions.degreeId,
        mode: 'insensitive',
      },
      ...(conditions.status && {status: conditions.status}),
    }

    const totalPages = await this.prisma.course.count({ where: whereConditions });
    const lastPage = Math.ceil(totalPages / (limit));

    return {
      data: await this.prisma.course.findMany({
        skip: (page - 1) * (limit),
        take: limit,
        where: whereConditions
      }),
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
      throw new NotFoundException(`No se encontro un programa de grado con este identificador`)
    }

    return {data: course};
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    await this.findById(id);

    try {
      return await this.prisma.course.update({
        where: { id },
        data: updateCourseDto,
      });
    } catch (error) {

      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException(`El codigo de clase ya existe`)
      }
    }
  }

  async delete(id: string){
    await this.findById(id);
    return await this.prisma.course.update({where: {id}, data:{status: CourseStatus.inactivo}});
  }
}
