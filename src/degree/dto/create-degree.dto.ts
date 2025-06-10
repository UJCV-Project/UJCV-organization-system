import { IsString, IsEnum, IsOptional, IsNotEmpty, MaxLength } from 'class-validator';
import { DegreeProgramStatus } from '../enum/degree-status';


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

