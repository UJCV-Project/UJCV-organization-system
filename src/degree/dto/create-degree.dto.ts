import { IsString, IsEnum, IsOptional, IsNotEmpty, Max, MaxLength } from 'class-validator';
import { DegreeProgramStatus } from '@prisma/client';

export class CreateDegreeDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    code: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    //TODO: Esto debe de ser un ENUM en vez de un string;
    /*@IsString()
    @IsNotEmpty()
    faculty: string;*/

    @IsEnum(DegreeProgramStatus)
    @IsOptional()
    status?: DegreeProgramStatus;
}

