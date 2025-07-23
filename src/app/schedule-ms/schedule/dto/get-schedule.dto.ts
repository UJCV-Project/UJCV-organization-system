import { IsOptional, IsString, IsUUID } from "class-validator";

export class GetScheduleDto{
    @IsString()
    @IsUUID()
    @IsOptional()
    professorId?: string

    @IsString()
    @IsUUID()
    @IsOptional()
    roomId?: string

    @IsString()
    @IsUUID()
    @IsOptional()
    courseId?: string 

    @IsString()
    @IsUUID()
    @IsOptional()
    academicPeriodId?: string
}