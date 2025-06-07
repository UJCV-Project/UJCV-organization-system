import { IsString, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { CurriculumStatus } from '@prisma/client';

export enum curriculumStatus {
    Activo = 'Activo',
    Inactivo = 'Inactivo'
}

export class CreateCurriculumDto {
    @IsString()
    code: string;

    @IsString()
    degreeProgramID: string;

    @IsDateString()
    startDate: string;

    @IsDateString()
    endDate: string;

    @IsString()
    description: string;

    @IsEnum(CurriculumStatus)
    @IsOptional()
    status?: CurriculumStatus; 
}