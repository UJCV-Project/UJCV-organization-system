import {
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateScheduleDiscussionDto {
  @IsString()
  @IsNotEmpty()
  userId: string; 

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  parentMessageId?: string;
}
