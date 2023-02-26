import { IsEmail } from 'class-validator';

export class AuthEmailDto {
  @IsEmail()
  email: string;
}
