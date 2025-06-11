import { IsString, IsInt, IsNotEmpty, Min, IsOptional } from 'class-validator';
import { CourseStatus } from '../enum/course-status';
export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  code: string; // codigo(unico) de la asignatura

  @IsString()
  @IsNotEmpty()
  name: string; // Nombre de la asignatura

  @IsString()
  @IsNotEmpty()
  degreeId: string; // Carrera

  @IsInt()
  @IsNotEmpty()
  @Min(3)
  credits: number; // numero de creditos 

  @IsOptional()
  @IsString()
  status: CourseStatus = CourseStatus.activo;
}
