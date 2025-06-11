import { IsUUID } from "class-validator";

export class DeleteCurriculumDto {
    @IsUUID()
    degreeId: string;

    @IsUUID()
    courseId: string;
}
