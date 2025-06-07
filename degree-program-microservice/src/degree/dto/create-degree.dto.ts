import { IsString, IsEnum, IsOptional } from 'class-validator';
import { DegreeProgramStatus } from '@prisma/client';

export class CreateDegreeDto {
    @IsString()
    code: string;

    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsEnum(DegreeProgramStatus)
    @IsOptional()
    status?: DegreeProgramStatus; // Opcional, Prisma pone el valor por defecto
}

