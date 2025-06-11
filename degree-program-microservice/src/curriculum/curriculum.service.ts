import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumDto } from './dto/update-curriculum.dto';
// Define CurriculumStatus enum here if needed, or use string literals directly

@Injectable()
export class CurriculumService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCurriculumDto) {
    try {
      const curriculum = await this.prisma.curriculum.create({
        data: {
          code: dto.code,
          degreeProgramId: dto.degreeProgramId,
          startDate: new Date(dto.startDate),
          endDate: new Date(dto.endDate),
          description: dto.description,
          status: dto.status ?? 'activo',
        },
      });
      return curriculum;
    } catch (error) {
      throw new BadRequestException(`Error creating curriculum: ${error.message}`);
    }
  }

  async findAll() {
    return this.prisma.curriculum.findMany({
      include: {
        degreeProgram: true,
        subjects: {
          include: { subject: true },
        },
        prerequisites: true,
      },
    });
  }

  async findOne(id: string) {
    const curriculum = await this.prisma.curriculum.findUnique({
      where: { id },
      include: {
        degreeProgram: true,
        subjects: {
          include: { subject: true },
        },
        prerequisites: true,
      },
    });

    if (!curriculum) {
      throw new NotFoundException(`Curriculum with ID ${id} not found`);
    }

    return curriculum;
  }

  async update(id: string, dto: UpdateCurriculumDto) {
    const exists = await this.prisma.curriculum.findUnique({ where: { id } });

    if (!exists) {
      throw new NotFoundException(`Curriculum with ID ${id} not found`);
    }

    try {
      return await this.prisma.curriculum.update({
        where: { id },
        data: {
          ...dto,
          startDate: dto.startDate ? new Date(dto.startDate) : undefined,
          endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        },
      });
    } catch (error) {
      throw new BadRequestException(`Error updating curriculum: ${error.message}`);
    }
  }

  async remove(id: string) {
    const exists = await this.prisma.curriculum.findUnique({ where: { id } });

    if (!exists) {
      throw new NotFoundException(`Curriculum with ID ${id} not found`);
    }

    return this.prisma.curriculum.delete({ where: { id } });
  }
}
