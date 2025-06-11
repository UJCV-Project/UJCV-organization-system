import {IsUUID, IsOptional, IsInt, Min } from 'class-validator';
export class CreateCurriculumDto {
  @IsUUID()
  degreeId: string;

  @IsUUID()
  courseId: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  semester: number;
}
