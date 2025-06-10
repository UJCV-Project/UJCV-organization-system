import { IsString, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { DegreeProgramStatus } from '../enum/degree-status';
import { PaginationDto } from 'src/common';

export class DegreePaginationDto extends PaginationDto{
    @IsString()
    @MaxLength(20)
    @IsOptional()
    code?: string = '';

    @IsString()
    @MaxLength(100)
    @IsOptional()
    name?: string = '';

    @IsString()
    @IsEnum(DegreeProgramStatus)
    @IsOptional()
    status?: DegreeProgramStatus;
}

