import { IsString, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { DegreeProgramStatus } from '@prisma/client';
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

