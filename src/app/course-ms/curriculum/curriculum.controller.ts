import { Controller, Get, Post, Body, Delete, Query, Param } from '@nestjs/common';
import { CurriculumService } from './curriculum.service';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { DeleteCurriculumDto } from './dto/delete-curriculum.dto';

@Controller('pensums')
export class CurriculumController {
  constructor(private readonly curriculumService: CurriculumService) {}

  @Post()
  create(@Body() createCurriculumDto: CreateCurriculumDto) {
    return this.curriculumService.create(createCurriculumDto);
  }

  @Get('/careers/:careerId')
  async findAll(@Param('careerId') careerId: string) {
    return await this.curriculumService.findDegreeCoursesBySemester(careerId);
  }

  //!Rewrite this
  @Delete()
  remove(@Query() deleteCurriculumDto: DeleteCurriculumDto) {
    return this.curriculumService.remove(deleteCurriculumDto);
  }
}
