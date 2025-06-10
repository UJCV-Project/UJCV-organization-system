import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { UpdateDegreeDto } from './dto/update-degree.dto';
import { DegreeDto } from './dto/response-degree.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, DegreeProgramStatus } from '@prisma/client';

@Injectable()
export class DegreeService {
  constructor(private prisma: PrismaService) { }

  async create(createDegreeDto: CreateDegreeDto) {
    const code = createDegreeDto.code;
    const existingDegree = await this.findOne(code);

    if (existingDegree) {
      throw new NotFoundException(`Ya existe un programa de grado con el código: ${code}`);
    }

    const degreeCreated = await this.prisma.degreeProgram.create({
      data: createDegreeDto
    });

    return degreeCreated;
  }


  async findAll(): Promise<DegreeDto[]> {

    const degree = await this.prisma.degreeProgram.findMany();
    return degree.map((degree) => ({
      id: degree.id,
      code: degree.code,
      name: degree.name,
      description: degree.description,
      status: degree.status,
      createdAt: degree.createdAt.toISOString(),
      updatedAt: degree.updatedAt.toISOString(),
    }))
  }

  async findOne(code: string) {

    const degree = await this.prisma.degreeProgram.findUnique({ where: { code } });

    if (!degree) {
      throw new NotFoundException(`No se encontro un programa de grado con este código: ${code}`)
    }

    return degree;
  }

  async update(code: string, updateDegreeDto: UpdateDegreeDto) {
    try {
      return await this.prisma.degreeProgram.update({
        where: { code },
        data: updateDegreeDto,
      });
    } catch (error) {

      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException(`El codigo de programa de grado ya existe`)
      }
    }
  }

  async remove(code: string) {
    const degree = await this.prisma.degreeProgram.findUnique({ where: { code } });
    if (!degree) {
      throw new NotFoundException(`No se encontró un programa de grado con este código ${code}`);
    }

    return this.prisma.degreeProgram.delete({ where: { code } });

  }
}
