import { DegreeProgramStatus } from "@prisma/client";

export class DegreeDto {
    id: string;
    code: string;
    name: string;
    description: string;
    status: DegreeProgramStatus;
    createdAt: string;
    updatedAt: string;
}
