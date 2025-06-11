import { Controller, Get, Post, Body, Patch, Param, Query, Delete } from '@nestjs/common';
import { DegreeService } from './degree.service';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { UpdateDegreeDto } from './dto/update-degree.dto';
import { DegreePaginationDto } from './dto/get-degree.dto';

@Controller('degree')
export class DegreeController {
  constructor(private readonly degreeService: DegreeService) {}

  @Post()
  async create(@Body() createDegreeDto: CreateDegreeDto) {
    return await this.degreeService.create(createDegreeDto);
  }

  //!Delete later
  @Post('/data-dump')
  async createMultiple(@Body() createDegreeDto:any[]) {
    return await this.degreeService.createMany(createDegreeDto);

  }

  @Get()
  async findAll(@Query() degreePagination: DegreePaginationDto) {
    return await this.degreeService.findAll(degreePagination);
  }

  @Get('id/:id')
  findOne(@Param('id') id: string) {
    return this.degreeService.findById(id); 
  }

  @Get('/list')
  async listDegree() {
    return await this.degreeService.listDegree();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDegreeDto: UpdateDegreeDto) {
    return this.degreeService.update(id, updateDegreeDto); 
  }

  @Delete(':id')
  changeStatus(@Param('id') id: string) {
    return this.degreeService.delete(id); 
  }
}
