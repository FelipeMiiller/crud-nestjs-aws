import { Role } from '@prisma/client';
import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserForIdDto {
  @ApiProperty()
  @IsString()
  idUser?: string;

  @ApiProperty()
  @IsString()
  idCompany?: string;
}

export class GetUserForEmailDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}

export class GetUsersForCompanyDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  idCompany?: string;
}

export class CreateUserForCompanyDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  document: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  idCompany: string;

  @ApiProperty()
  @IsEnum(Role, { each: true })
  readonly role: Role;
}

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  document: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;
}

export class UpdatePermissionUserDto {
  @ApiProperty()
  @IsString()
  idUser: string;

  @ApiProperty()
  @IsString()
  idCompany: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Role, { each: true })
  readonly role: Role;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  status: boolean;
}

export class DeletePermissionUserDto {
  @ApiProperty()
  @IsString()
  idPermission: string;

 
}
