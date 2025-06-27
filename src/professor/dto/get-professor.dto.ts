import { IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/common";

export class GetProfessorDto extends PaginationDto{
    @IsOptional() @IsString() code? : string;
    @IsOptional() @IsString() firstName? : string;
    @IsOptional() @IsString() lastName? : string;
}