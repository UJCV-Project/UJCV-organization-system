import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CourseDto } from './dto/response-course.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCourseDto: CreateCourseDto) {
    return 'This action adds a new course';
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

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return `This action updates a #${id} course`;
  }

  remove(id: number) {
    return `This action removes a #${id} course`;
  }
}
