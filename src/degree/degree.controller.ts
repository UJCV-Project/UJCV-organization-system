import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DegreeService } from './degree.service';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { UpdateDegreeDto } from './dto/update-degree.dto';
import { DegreePaginationDto } from './dto/get-degree.dto';
import { DegreeProgramStatus } from './enum/degree-status';

@Controller('degree')
export class DegreeController {
  constructor(private readonly degreeService: DegreeService) {}

  @Post()
  async create(@Body() createDegreeDto: CreateDegreeDto) {
    return await this.degreeService.create(createDegreeDto);
  }

  @Get()
  async findAll(@Query() degreePagination: DegreePaginationDto) {
    return await this.degreeService.findAll(degreePagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.degreeService.findById(id); 
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDegreeDto: UpdateDegreeDto) {
    return this.degreeService.update(id, updateDegreeDto); 
  }

  @Patch('/change-status/:id')
  changeStatus(@Param('id') id: string) {
    return this.degreeService.delete(id); 
  }
}
