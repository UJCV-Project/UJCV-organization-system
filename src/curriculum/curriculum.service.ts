import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCurriculumDto, curriculumStatus } from './dto/create-curriculum.dto';
import { UpdateCurriculumDto } from './dto/update-curriculum.dto';

@Injectable()
export class CurriculumService {
  constructor(private readonly prisma: PrismaService) {}

  // Crear un nuevo plan de estudios
  async create(createCurriculumDto: CreateCurriculumDto) {
    const {
      code,
      degreeProgramID,
      startDate,
      endDate,
      description,
      status,
    } = createCurriculumDto;

    // Validar existencia del programa académico
    const degreeProgram = await this.prisma.degreeProgram.findUnique({
      where: { id: degreeProgramID },
    });

    if (!degreeProgram) {
      throw new NotFoundException(`No existe un programa académico con ID: ${degreeProgramID}`);
    }

    // Crear el plan de estudios
    const newCurriculum = await this.prisma.curriculum.create({
      data: {
        code,
        degreeProgramId: degreeProgramID,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        description,
        status: createCurriculumDto.status, 
      },
    });
  
    return {
      message: 'Plan de estudios creado exitosamente.',
      curriculum: newCurriculum,
    };
  }

  // Obtener todos los planes de estudio
  async findAll(): Promise<any[]> {
    const curriculums = await this.prisma.curriculum.findMany({
      include: {
        degreeProgram: true,
      },
    });

    return curriculums.map((curriculum) => ({
      id: curriculum.id,
      code: curriculum.code,
      degreeProgramID: curriculum.degreeProgramId,
      startDate: curriculum.startDate.toISOString(),
      endDate: curriculum.endDate.toISOString(),
      description: curriculum.description,
      status: curriculum.status,
      createdAt: curriculum.createdAt.toISOString(),
      updatedAt: curriculum.updatedAt.toISOString(),
      degreeProgramName: curriculum.degreeProgram.name,
    }));
  }

  // Obtener un plan de estudios por ID
  async findOne(id: string) {
    const curriculum = await this.prisma.curriculum.findUnique({
      where: { id },
      include: {
        degreeProgram: true,
        subjects: true,
        prerequisites: true,
      },
    });

    if (!curriculum) {
      throw new NotFoundException(`No se encontró un plan de estudios con el ID: ${id}`);
    }

    return {
      id: curriculum.id,
      code: curriculum.code,
      degreeProgramID: curriculum.degreeProgramId,
      startDate: curriculum.startDate.toISOString(),
      endDate: curriculum.endDate.toISOString(),
      description: curriculum.description,
      status: curriculum.status,
      createdAt: curriculum.createdAt.toISOString(),
      updatedAt: curriculum.updatedAt.toISOString(),
      degreeProgramName: curriculum.degreeProgram.name,
    };
  }

  // Actualizar un plan de estudios
  async update(id: string, updateCurriculumDto: UpdateCurriculumDto) {
    const existing = await this.prisma.curriculum.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException(`No se encontró un plan de estudios con el ID: ${id}`);
    }

    // Validar si se quiere cambiar el programa académico
    if (updateCurriculumDto.degreeProgramID) {
      const program = await this.prisma.degreeProgram.findUnique({
        where: { id: updateCurriculumDto.degreeProgramID },
      });

      if (!program) {
        throw new BadRequestException(`No existe un programa académico con ID: ${updateCurriculumDto.degreeProgramID}`);
      }
    }

    const updated = await this.prisma.curriculum.update({
      where: { id },
      data: {
        ...updateCurriculumDto,
        degreeProgramId: updateCurriculumDto.degreeProgramID || undefined,
        startDate: updateCurriculumDto.startDate ? new Date(updateCurriculumDto.startDate) : undefined,
        endDate: updateCurriculumDto.endDate ? new Date(updateCurriculumDto.endDate) : undefined,
      },
    });

    return {
      message: 'Plan de estudios actualizado correctamente.',
      curriculum: updated,
    };
  }

  // Eliminar un plan de estudios
  async remove(id: string) {
    const existing = await this.prisma.curriculum.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException(`No se encontró un plan de estudios con el ID: ${id}`);
    }

    await this.prisma.curriculum.delete({ where: { id } });

    return { message: `Plan de estudios con ID ${id} eliminado exitosamente.` };
  }
}