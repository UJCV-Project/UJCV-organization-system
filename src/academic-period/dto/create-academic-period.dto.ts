import { IsDateString, IsNotEmpty } from "class-validator";

export class CreateAcademicPeriodDto {

    @IsDateString()
    @IsNotEmpty()
    startDate: string

    @IsDateString()
    @IsNotEmpty()
    endDate: string

}
