import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CoursePaginationDto } from './dto/get-course.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles, Permissions } from 'src/common/auth/rbac.decorator';
import { RbacGuard } from 'src/common/auth/rbac.guard';
import { PERMISSIONS, ROLES } from 'src/common/auth/rbac.enum';

@Controller('subjects')
@UseGuards(RbacGuard)
export class CourseController {
  constructor(private readonly courseService: CourseService) { }

  @Roles(ROLES.ADMIN)
  @Permissions(PERMISSIONS.SUBJECTS.CREATE)
  @Post()
  @ApiOperation({ summary: 'Crea un nuevo registro de clase', description: 'Se utiliza la estructura `CreateCourseDto` para crear un nuevo registro de clase o curso de la universidad' })
  @ApiBearerAuth('jwt')
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @UseGuards(RbacGuard)
  @Roles(ROLES.ADMIN)
  @Permissions('get_subjects')
  @ApiBearerAuth('jwt')
  @Get()
  async getAll(@Query() coursePaginationDto: CoursePaginationDto) {
    return await this.courseService.findAll(coursePaginationDto);
  }

  @UseGuards(RbacGuard)
  @Roles(ROLES.ADMIN)
  @Permissions('find_subjects')
  @ApiBearerAuth('jwt')
  @Get(':id')
  find(@Param('id') id: string) {
    return this.courseService.findById(id);
  }

  @UseGuards(RbacGuard)
  @Roles(ROLES.ADMIN)
  @Permissions('edit_subjects')
  @ApiBearerAuth('jwt')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(id, updateCourseDto);
  }

  @UseGuards(RbacGuard)
  @Roles(ROLES.ADMIN)
  @Permissions('delete_subjects')
  @ApiBearerAuth('jwt')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.courseService.delete(id);
  }
}
