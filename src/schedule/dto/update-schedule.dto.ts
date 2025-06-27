import { IsString, IsUUID } from "class-validator";

export class UpdateScheduleDto{
    @IsString()
    @IsUUID()
    id: string;
}