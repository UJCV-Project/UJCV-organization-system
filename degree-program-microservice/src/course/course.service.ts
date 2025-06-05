import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CourseDto } from './dto/response-course.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto) {
    const { code, name, description, credits, type } = createCourseDto;

    const existingSubject = await this.prisma.subject.findUnique({
      where: { code },
    });

    if (existingSubject) {
      throw new NotFoundException(`Ya existe una asignatura con el código: ${code}`);
    }

    const subject = await this.prisma.subject.create({
      data: {
        code,
        name,
        description,
        credits,
        type,
      },
    });

    return {
      id: subject.id,
      code: subject.code,
      name: subject.name,
      description: subject.description,
      credits: subject.credits,
      type: subject.type,
    };
  }

  async findAll(): Promise<CourseDto[]> {
    const subjects = await this.prisma.subject.findMany();
    return subjects.map((subject) => ({
      id: subject.id,
      code: subject.code,
      name: subject.name,
      description: subject.description,
      credits: subject.credits,
      type: subject.type
    }));
  }

  async findOne(id: string) {
    const subject = await this.prisma.subject.findUnique({ where :{id},});

    if(!subject){
      throw new NotFoundException(`No se que encontro una asignatura con el ID: ${id}`)
    }
    
    return {
      id: subject.id,
      code: subject.code,
      name: subject.name,
      description: subject.description,
      credits: subject.credits,
      type: subject.type
    }
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    try {
      return await this.prisma.subject.update({
        where: { id },
        data: updateCourseDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException('El código de asignatura ya existe.');
      }
      throw error;
    }
  }

  remove(id: string) {
    return `This action removes a #${id} curriculum`;
  }
}
