import { IsString, IsEmail, IsNotEmpty, IsPhoneNumber,MaxLength } from 'class-validator';

export class CreateProfessorDto {
  @IsString() @IsNotEmpty() @MaxLength(20) code: string;
  @IsString() @IsNotEmpty() @MaxLength(50) firstName: string;
  @IsString() @IsNotEmpty() @MaxLength(50) lastName: string;
  @IsEmail() @IsNotEmpty() @MaxLength(50) email: string;
  @IsNotEmpty() @IsPhoneNumber('HN') @MaxLength(20) phoneNumber: string;
}
