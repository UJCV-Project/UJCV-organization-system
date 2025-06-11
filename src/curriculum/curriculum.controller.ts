import { Controller, Get, Post, Body, Delete, Query, Param } from '@nestjs/common';
import { CurriculumService } from './curriculum.service';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { DeleteCurriculumDto } from './dto/delete-curriculum.dto';

@Controller('curriculum')
export class CurriculumController {
  constructor(private readonly curriculumService: CurriculumService) {}

  @Post()
  create(@Body() createCurriculumDto: CreateCurriculumDto) {
    return this.curriculumService.create(createCurriculumDto);
  }

  @Get()
  findAll(@Param('degreeId') degreeId: string) {
    return this.curriculumService.findDegreeCoursesBySemester(degreeId);
  }

  @Delete()
  remove(@Query() deleteCurriculumDto: DeleteCurriculumDto) {
    return this.curriculumService.remove(deleteCurriculumDto);
  }
}
