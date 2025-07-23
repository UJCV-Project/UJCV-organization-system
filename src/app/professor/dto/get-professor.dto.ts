import { IsBoolean, IsEnum, IsIn, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/common";
import { ProfessorStatus } from "../enums/professorStatus";
import { ProfessorActivity } from "../enums/professorActivity";

export class GetProfessorDto extends PaginationDto{
    @IsOptional() @IsString() code? : string;
    @IsOptional() @IsString() firstName? : string;
    @IsOptional() @IsEnum(ProfessorStatus) status? : ProfessorStatus;
    @IsOptional() @IsEnum(ProfessorActivity) activity?: ProfessorActivity;
}