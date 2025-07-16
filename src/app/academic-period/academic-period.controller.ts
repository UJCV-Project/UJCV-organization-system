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
}
