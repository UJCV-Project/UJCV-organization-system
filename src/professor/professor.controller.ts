import { Body, Controller, Get, Param, Post, Patch, Query } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { CreateProfessorDto, GetProfessorDto, UpdateProfessorDto } from './dto';

@Controller('professor')
export class ProfessorController {
  constructor(private readonly service: ProfessorService) {}

  @Post()
  async create(@Body() dto: CreateProfessorDto) {
    return await this.service.createProfessor(dto);
  }

  @Get()
  async findAll(@Query() professorPagination: GetProfessorDto) {
    return await this.service.findAllProfessor(professorPagination);
  }

  @Get('list')
  async getList() {
    return await this.service.getListProfessor();
  }

  @Get('id/:code')
  findByCode(@Param() code: string) {
    return this.service.findProfessorByCode(code);
  }

  @Patch('id/:code')
  updateByCode(@Body() updateProfessorByCode:UpdateProfessorDto, @Param('id') id: string) {
    return this.service.updateProfessor(id, updateProfessorByCode);
  }
}
