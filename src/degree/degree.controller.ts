import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DegreeService } from './degree.service';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { UpdateDegreeDto } from './dto/update-degree.dto';

@Controller('degree')
export class DegreeController {
  constructor(private readonly degreeService: DegreeService) {}

  @Post()
  async create(@Body() createDegreeDto: CreateDegreeDto) {
    return await this.degreeService.create(createDegreeDto);
  }

  @Get()
  async findAll() {
    return await this.degreeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.degreeService.findOne(id); 
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDegreeDto: UpdateDegreeDto) {
    return this.degreeService.update(id, updateDegreeDto); 
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.degreeService.remove(id);
  }
}
