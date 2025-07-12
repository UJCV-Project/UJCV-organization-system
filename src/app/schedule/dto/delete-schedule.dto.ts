import { IsString, IsUUID } from "class-validator";

export class DeleteScheduleDto{
    @IsString()
    @IsUUID()
    id: string;
}