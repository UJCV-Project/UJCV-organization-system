import { IsString, IsInt, IsNotEmpty, Min, IsOptional } from 'class-validator';
import { CourseStatus } from '../enum/course-status';
import { ApiProperty } from '@nestjs/swagger';
export class CreateCourseDto {
  @ApiProperty({ example: 'IIT4025', description: 'Código único interno que se utiliza como identificador de clase' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'Seguridad en Redes Inalámbrica', description: 'Nombre de la clase' })
  @IsString()
  @IsNotEmpty()
  name: string; // Nombre de la asignatura

  @ApiProperty({ example: '3', description: 'Unidades Valorativas de la clase' })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  unitValue: number; // numero de creditos 

  @ApiProperty({ example: '3', description: 'Horas teóricas por semana de la clase' })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  theoryHours: number;

  @ApiProperty({ example: '0', description: 'Horas prácticas de la clase' })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  practiceHours: number;

  @ApiProperty({ example: 'activo', description: 'Estado de gestión de la clase, se utiliza `CourseStatus` para la definición de estados' })
  @IsOptional()
  @IsString()
  status: CourseStatus = CourseStatus.activo;
}
