import { IsString, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { DegreeStatus } from '../enum/degree-status';
import { PaginationDto } from 'src/common';

export class DegreePaginationDto extends PaginationDto{
    @IsString()
    @MaxLength(100)
    @IsOptional()
    search?: string = '';

    @IsString()
    @IsEnum(DegreeStatus)
    @IsOptional()
    status?: DegreeStatus = DegreeStatus.activo;
}

