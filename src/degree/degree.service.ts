import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { UpdateDegreeDto } from './dto/update-degree.dto';
import { DegreeDto } from './dto/response-degree.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { DegreeProgramStatus } from './enum/degree-status';
import { DegreePaginationDto } from './dto/get-degree.dto';

@Injectable()
export class DegreeService {
  constructor(private prisma: PrismaService) { }
  logger = new Logger('Degree Service');

  async create(createDegreeDto: CreateDegreeDto) {
    const code = createDegreeDto.code;
    const existingDegree = await this.prisma.degreeProgram.findFirst({where:{code}});

    if (existingDegree?.status === DegreeProgramStatus.activo) {
      throw new ConflictException(`Ya existe un programa de grado con el código: ${code}`);
    }

    const degreeCreated = await this.prisma.degreeProgram.upsert({
    where: { id: existingDegree?.id},
    update: createDegreeDto, 
    create: createDegreeDto,
    });

    return degreeCreated;
  }

  async findAll(degreePagination: DegreePaginationDto) {
    const { page = 1, limit = 10, ...conditions } = degreePagination;

    const whereConditions: any = {
      code: {
        contains: conditions.code,
        mode: 'insensitive',
      },
      name: {
        contains: conditions.name,
        mode: 'insensitive',
      },
      ...(conditions.status && {status: conditions.status}),
    }

    const totalPages = await this.prisma.degreeProgram.count({ where: whereConditions });
    const lastPage = Math.ceil(totalPages / (limit));

    return {
      data: await this.prisma.degreeProgram.findMany({
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
    const degree = await this.prisma.degreeProgram.findUnique({ where: { id } });
    if (!degree) {
      throw new NotFoundException(`No se encontro un programa de grado con este identificador`)
    }

    return {data: degree};
  }

  async update(id: string, updateDegreeDto: UpdateDegreeDto) {
    await this.findById(id);

    try {
      return await this.prisma.degreeProgram.update({
        where: { id },
        data: updateDegreeDto,
      });
    } catch (error) {

      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException(`El codigo de programa de grado ya existe`)
      }
    }
  }

  async delete(id: string){
    await this.findById(id);
    return await this.prisma.degreeProgram.update({where: {id}, data:{status: DegreeProgramStatus.inactivo}});
  }
}
