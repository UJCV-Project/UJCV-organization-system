import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength } from "class-validator";
import { ROOM_TYPE } from "../enum/room-type";
import { BUILDING } from "../enum/building";

export class CreateRoomDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsEnum(ROOM_TYPE)
    room_type: ROOM_TYPE;

    @IsPositive()
    @IsNotEmpty()
    capacity: number;

    @IsString()
    @IsNotEmpty()
    @IsEnum(BUILDING)
    building: BUILDING;

    @IsPositive()
    @IsNotEmpty()
    floor: number;

    @IsString()
    @IsOptional()
    equipment: string; //It can also be a string separated by comma
}
