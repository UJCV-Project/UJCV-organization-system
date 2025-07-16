import { IsString, IsEmail, IsNotEmpty, IsPhoneNumber,MaxLength, IsEnum, IsOptional } from 'class-validator';
import { ProfessorStatus } from '../enums/professorStatus';

export class CreateProfessorDto {
  @IsString() @IsNotEmpty() @MaxLength(20) code: string;
  @IsString() @IsNotEmpty() @MaxLength(50) firstName: string;
  @IsString() @IsNotEmpty() @MaxLength(50) lastName: string;
  @IsEmail() @IsNotEmpty() @MaxLength(50) email: string;
  @IsString() @IsOptional() @IsEnum(ProfessorStatus) status: ProfessorStatus = ProfessorStatus.ACTIVO;
  @IsNotEmpty() @IsPhoneNumber('HN') @MaxLength(20) phoneNumber: string;
}
