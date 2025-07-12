import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProfessorDto, GetProfessorDto, UpdateProfessorDto } from './dto';
import { ProfessorStatus } from './enums/professorStatus';
import { SelectOption } from 'src/common/select-option';

@Injectable()
export class ProfessorService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProfessorDto) {
    try {
      const result = await this.prisma.professor.create({ data });
      return result;
    } catch (error) {
      if (error.code === 'P2002') {
        const response = {
          message: `El campo ${error.meta.target[0]} está duplicado`,
          error: 'Campos Duplicados',
          statusCode: HttpStatus.CONFLICT,
        };
        throw new ConflictException({ response });
      }
    }
  }

  async get(professorPagination: GetProfessorDto) {
    const { page = 1, limit = 10, ...conditions } = professorPagination;

    const totalPages = await this.prisma.professor.count({ where: conditions });
    const lastPage = Math.ceil(totalPages / limit);

    return {
      data: await this.prisma.professor.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: conditions,
      }),
      metadata: {
        total: totalPages,
        page: page,
        lastPage: lastPage,
      },
    };
  }

  async find(id: string) {
    const data = await this.prisma.professor.findUnique({
      where: { id },
    });

    if (data === null) {
      const response = {
        message: `No se ha encontrado ningún profesor con el código ${id}`,
        error: 'No hay registro',
        statusCode: HttpStatus.NOT_FOUND,
      };
      throw new NotFoundException({ response });
    }

    const result = { data };
    return result;
  }

  async selectOptions(): Promise<{data:SelectOption[]}> {
    const rawProfessors = await this.prisma.professor.findMany({
      where: { status: ProfessorStatus.ACTIVO },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    const professors: SelectOption[] = rawProfessors.map((p) => ({
      value: p.id,
      label: `${p.firstName} ${p.lastName}`,
    }));

    return { data: professors };
  }

  async update(id: string, data: UpdateProfessorDto) {
    await this.find(id);
    try {
      const result = await this.prisma.professor.update({
        where: { id },
        data,
      });
      return result;
    } catch (error) {
        throw new InternalServerErrorException(error.message);
    }
  }

  delete(id: string) {
    this.find(id);
    return this.prisma.professor.update({
      where: { id },
      data: { status: ProfessorStatus.INACTIVO },
    });
  }
}
