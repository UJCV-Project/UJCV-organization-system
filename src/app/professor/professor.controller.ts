import { Body, Controller, Get, Param, Post,Delete, Patch, Query } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { CreateProfessorDto, GetProfessorDto, UpdateProfessorDto } from './dto';

@Controller('professors')
export class ProfessorController {
  constructor(private readonly service: ProfessorService) {}

  @Post()
  async create(@Body() dto: CreateProfessorDto) {
    return await this.service.create(dto);
  }

  @Get()
  async getAll(@Query() professorPagination: GetProfessorDto) {
    return await this.service.get(professorPagination);
  }

  @Get(':id')
  find(@Param('id') id: string) {
    return this.service.find(id);
  }

  @Patch(':id')
  update(@Body() updateProfessorByCode:UpdateProfessorDto, @Param('id') id: string) {
    return this.service.update(id, updateProfessorByCode);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
