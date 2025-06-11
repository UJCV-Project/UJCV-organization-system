import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { UpdateDegreeDto } from './dto/update-degree.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { DegreeStatus, } from './enum/degree-status';
import { DegreePaginationDto } from './dto/get-degree.dto';

@Injectable()
export class DegreeService {
  constructor(private prisma: PrismaService) { }
  logger = new Logger('Degree Service');

  async create(createDegreeDto: CreateDegreeDto) {
    const code = createDegreeDto.code;
    const existingDegree = await this.prisma.degree.findFirst({ where: { code } });

    if (existingDegree?.status === DegreeStatus.activo) {
      throw new ConflictException(`Ya existe una carrera con el código: ${code}`);
    }

    const degreeCreated = await this.prisma.degree.upsert({
      where: { code },
      update: createDegreeDto,
      create: createDegreeDto,
    });

    return degreeCreated;
  }

  //!DELETE LATER
  async createMany(data: any) {
    this.logger.log(data);
  return await this.prisma.degree.createMany({
    data,
    skipDuplicates: true, 
  });
}

  async findAll(degreePagination: DegreePaginationDto) {
    const { page = 1, limit = 10, ...conditions } = degreePagination;

    const whereConditions: any = {
      AND: [
        {
          OR: [
            { code: { contains: conditions.search, mode: 'insensitive' } },
            { name: { contains: conditions.search, mode: 'insensitive' } },
          ],
        },
        ...(conditions.status ? [{ status: conditions.status }] : []),
      ],
    };

    const totalPages = await this.prisma.degree.count({ where: whereConditions });
    const lastPage = Math.ceil(totalPages / (limit));

    return {
      data: await this.prisma.degree.findMany({
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
    const degree = await this.prisma.degree.findUnique({ where: { id } });
    if (!degree) {
      throw new NotFoundException(`No se encontro un programa de grado con este identificador`)
    }

    return { data: degree };
  }

  async listDegree() {
    const listDegree = await this.prisma.degree.findMany({
      where: { status: DegreeStatus.activo },
      select: {
        id: true,
        code: true,
        name: true,
      }
    });

    if (!listDegree) {
      return [];
    }

    const result = listDegree.map(degree => ({
      id: degree.id,
      text: `${degree.code} ${degree.name}`
    }));

    return result;
  }

  async update(id: string, updateDegreeDto: UpdateDegreeDto) {
    await this.findById(id);

    try {
      return await this.prisma.degree.update({
        where: { id },
        data: updateDegreeDto,
      });
    } catch (error) {

      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException(`El codigo de programa de grado ya existe`)
      }
    }
  }

  async delete(id: string) {
    await this.findById(id);
    return await this.prisma.degree.update({ where: { id }, data: { status: DegreeStatus.inactivo } });
  }
}
