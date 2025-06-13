import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CoursePaginationDto } from './dto/get-course.dto';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @Get()
  async findAll(@Query() coursePaginationDto:CoursePaginationDto) {
    return await this.courseService.findAll(coursePaginationDto);
  }

  @Get('id/:id')
  findOne(@Param('id') id: string) {
    return this.courseService.findById(id);
  }

  @Get('/list')
  async listCourses() {
    return await this.courseService.listCourses();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(id, updateCourseDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.courseService.delete(id);
  }
}
