import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AcademicPeriodService } from './academic-period.service';
import { CreateAcademicPeriodDto } from './dto/create-academic-period.dto';

@Controller('academic-period')
export class AcademicPeriodController {
  constructor(private readonly academicPeriodService: AcademicPeriodService) {}

  @Post()
  create(@Body() createAcademicPeriodDto: CreateAcademicPeriodDto) {
    return this.academicPeriodService.create(createAcademicPeriodDto);
  }

  @Get('id/:id')
  getById(@Param() id: string){
    return this.academicPeriodService.getById(id);
  }

  @Get('/list')
  getList(){
    return this.academicPeriodService.getList();
  } 

  @Get('/current')
  getCurrent(){
    return this.academicPeriodService.getCurrent();
  }
}
