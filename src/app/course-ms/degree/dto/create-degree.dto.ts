import { IsString, IsEnum, IsOptional, IsNotEmpty, MaxLength } from 'class-validator';
import { DegreeStatus } from '../enum/degree-status';


export class CreateDegreeDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    code: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    status: DegreeStatus = DegreeStatus.activo;
}

