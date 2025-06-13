import { IsString, IsInt, IsNotEmpty, Min, IsOptional } from 'class-validator';
import { CourseStatus } from '../enum/course-status';
export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  code: string; // codigo(unico) de la asignatura

  @IsString()
  @IsNotEmpty()
  name: string; // Nombre de la asignatura

  @IsInt()
  @IsNotEmpty()
  @Min(3)
  unitValue: number; // numero de creditos 

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  theoryHours: number; // horas teóricas

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  practiceHours: number; // horas prácticas

  @IsOptional()
  @IsString()
  status: CourseStatus = CourseStatus.activo;
}
