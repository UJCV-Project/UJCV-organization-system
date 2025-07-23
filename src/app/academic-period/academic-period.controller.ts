import { Controller, Get, Post, Body, Patch, Param, Delete, NotImplementedException } from '@nestjs/common';
import { AcademicPeriodService } from './academic-period.service';
import { CreateAcademicPeriodDto } from './dto/create-academic-period.dto';

@Controller('periods')
export class AcademicPeriodController {
  constructor(private readonly academicPeriodService: AcademicPeriodService) {}

  //!Not ready to implement
  @Post()
  create(@Body() createAcademicPeriodDto: CreateAcademicPeriodDto) {
    return this.academicPeriodService.create(createAcademicPeriodDto);
  }

  @Get()
  getAllPeriods(){
    return this.academicPeriodService.getAllPeriods();
  }

  @Get('current')
  getCurrentPeriod(){
    return this.academicPeriodService.getCurrent();
  }

  @Get(':periodId')
  getPeriodById(@Param('periodId') periodId: string) {
    return this.academicPeriodService.getPeriodById(periodId);
  }
}
