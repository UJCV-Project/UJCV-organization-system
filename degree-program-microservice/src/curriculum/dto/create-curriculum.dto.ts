import {
  IsString,
  IsUUID,
  IsDateString,
  IsOptional,
  MaxLength,
  IsEnum,
} from 'class-validator';
// Define CurriculumStatus enum manually if not exported from @prisma/client
export enum CurriculumStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export class CreateCurriculumDto {
  @IsString()
  @MaxLength(20)
  code: string;

  @IsUUID()
  degreeProgramId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  @MaxLength(100)
  description: string;

  @IsOptional()
  @IsEnum(CurriculumStatus, {
    message: `status must be one of: ${Object.values(CurriculumStatus).join(', ')}`,
  })
  status?: CurriculumStatus;
}
