import { IsString, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { CourseStatus } from '../enum/course-status';
import { PaginationDto } from 'src/common';

export class CoursePaginationDto extends PaginationDto{
    @IsString()
    @MaxLength(20)
    @IsOptional()
    code?: string = '';

    @IsString()
    @MaxLength(100)
    @IsOptional()
    name?: string = '';

    @IsString()
    @MaxLength(100)
    @IsOptional()
    degreeId?: string = '';

    @IsString()
    @IsEnum(CourseStatus)
    @IsOptional()
    status?: CourseStatus = CourseStatus.activo;
}

