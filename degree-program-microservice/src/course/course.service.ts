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
    
    else if(code.length>20){
      throw new BadRequestException(`El codigo de asignatura se excedió la el número de digitos en el código de la clase en ${code.length}`)
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

  async findOne(code: string) {
    const subject = await this.prisma.subject.findUnique({ where :{code},});

    if(!subject){
      throw new NotFoundException(`No se que encontro una asignatura con el código: ${code}`)
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

  async update(code: string, updateCourseDto: UpdateCourseDto) {
    try {
      return await this.prisma.subject.update({
        where: { code },
        data: updateCourseDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException('El código de asignatura ya existe.');
      }
      throw error;
    }
  }

  async remove(code: string) {
    const subject = await this.prisma.subject.findUnique({ where: { code } });
    if (!subject) {
      throw new NotFoundException(`No se encontró una asignatura con el código: ${code}`);
    }

    return this.prisma.subject.delete({ where: { code } });
  }
}
