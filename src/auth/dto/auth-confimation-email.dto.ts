import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class AuthConfirmationEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
