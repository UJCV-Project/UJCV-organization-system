import {IsUUID, IsOptional, IsInt, Min, IsString } from 'class-validator';
export class CreateCurriculumDto {
  @IsUUID()
  @IsString()
  degreeId: string;

  @IsString()
  @IsUUID()
  courseId: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  semester: number;
}
