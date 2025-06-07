import { IsString, IsInt, IsOptional, IsEnum } from 'class-validator';
import { SubjectType } from '@prisma/client';
export class CreateCourseDto {
    @IsString()
  code: string; // codigo(unico) de la asignatura

    @IsString()
  name: string; // Nombre de la asignatura

    @IsString()
  description: string; // una descripcion breve de la clase

    @IsInt()
  credits: number; // numero de creditos 

    @IsEnum(SubjectType)
    @IsOptional()
  type?: SubjectType; // tiene un valor por defecto,por eso es opcional
}
