import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export class EventDto {
  @IsNumber()
  @Min(0)
  @Max(6)
  day: number; //monday = 0

  @IsNumber()
  @Min(0)
  startTime: number; //ej. 0700

  @IsNumber()
  @Min(0)
  endTime: number; //ej. 2100
}

export class CreateScheduleDto {
  @IsString()
  @IsNotEmpty()
  academicPeriodId: string; 

  @IsString()
  @IsNotEmpty()
  professorId: string;

  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsString()
  section: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventDto)
  events: EventDto[];
}
