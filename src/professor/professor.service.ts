import { ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ProfessorStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProfessorDto, GetProfessorDto, UpdateProfessorDto } from './dto';

@Injectable()
export class ProfessorService {
  constructor(private prisma: PrismaService) { }


  async createProfessor(data: CreateProfessorDto) {
    const result = await this.createProfessorEntry(data);
    return result;
  }

  async createProfessorEntry(data: CreateProfessorDto) {
    try {
      const result = await this.prisma.professor.create({ data });
      return result;
    } catch (error) {
      if (error.code === "P2002") {
        const response = {
          message: `El campo ${error.meta.target[0]} está duplicado`,
          error: 'Campos Duplicados',
          statusCode: HttpStatus.CONFLICT,
        }
        throw new ConflictException({ response });
      }
    }
  }

  async findAllProfessor(professorPagination: GetProfessorDto) {
    const { page = 1, limit = 10, ...conditions } = professorPagination;

    const totalPages = await this.prisma.professor.count({ where: conditions });
    const lastPage = Math.ceil(totalPages / limit);

    return {
      data: await this.prisma.professor.findMany({
        skip: (page-1) * limit,
        take: limit,
        where: conditions
      }),
      metadata: {
        total: totalPages,
        page: page,
        lastPage: lastPage,
      },
    };
  }

  async findProfessorByCode(code: string) {
    const data = await this.prisma.professor.findUnique({
      where: { code },
    });

    if (data === null) {
      const response = {
        message: `No se ha encontrado ningún profesor con el código ${code}`,
        error: 'No hay registro',
        statusCode: HttpStatus.NOT_FOUND,
      }
      throw new NotFoundException({ response });
    }

    const result = { data };
    return result;
  }

  async getListProfessor() {
    const rawProfessors = await this.prisma.professor.findMany({
      where: { status: ProfessorStatus.activo },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    const professors = rawProfessors.map(p => ({
      id: p.id,
      text: `${p.firstName} ${p.lastName}`,
    }));

    return {data:professors}
  }

  async updateProfessor(code: string, data: UpdateProfessorDto) {
    await this.findProfessorByCode(code);
    const result = await this.updateProfessorEntry(code, data);
    return result;
  }

  async updateProfessorEntry(code: string, data: UpdateProfessorDto) {
    try {
      const result = await this.prisma.professor.update({ where: { code }, data });
      return result;
    } catch (error) {
      if (error.code === "P2002") {
        const response = {
          message: `El campo ${error.meta.target[0]} está duplicado`,
          error: 'Campos Duplicados',
          statusCode: HttpStatus.CONFLICT,
        }
        throw new ConflictException({ response });
      }
    }
  }
}
