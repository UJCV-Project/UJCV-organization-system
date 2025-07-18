import { Body, Controller, Get, Param, Post,Delete, Patch, Query, NotImplementedException } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { CreateProfessorDto, GetProfessorDto, UpdateProfessorDto } from './dto';

@Controller('professors')
export class ProfessorController {
  constructor(private readonly service: ProfessorService) {}

  /* CRUD */
  @Post()
  async create(@Body() dto: CreateProfessorDto) {
    return await this.service.create(dto);
  }

  @Get()
  async getAll(@Query() professorPagination: GetProfessorDto) {
    return await this.service.getProfessors(professorPagination);
  }

  @Get(':professorId')
  find(@Param('professorId') professorId: string) {
    return this.service.find(professorId);
  }

  @Patch(':professorId')
  update(@Body() updateProfessorByCode:UpdateProfessorDto, @Param('professorId') professorId: string) {
    return this.service.update(professorId, updateProfessorByCode);
  }

  @Delete(':professorId')
  delete(@Param('professorId') professorId: string) {
    return this.service.delete(professorId);
  }
}
