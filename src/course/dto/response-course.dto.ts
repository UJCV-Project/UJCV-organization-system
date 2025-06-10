import { SubjectType } from '@prisma/client';

export class CourseDto {
    id: string;
    code: string;
    name: string;
    description: string;
    credits: number;
    type: SubjectType;
}
