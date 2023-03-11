import { Role } from '@prisma/client';
import { PermissionType } from './typesPermission';

export interface UserYourPermissionsType {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  document: string;
  email: string;
  name: string;
  permissions: PermissionType[];
}

export interface UserType {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  document: string;
  email: string;
  name: string;
  permission?: PermissionType;
}

export interface UpdateUserType {
  id?: string;
  document?: string;
  name?: string;
}

export interface UpdatePermissionUserType {
  idUser: string;
  idCompany: string;
  role?: Role;
  status?: boolean;
}

export interface PermissionType {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  role?: Role;
  status?: boolean;
  companyId?: string;
  userId?: string;
  user?: UserType;
}

export interface DeletePermissionUserType {
  idUser: string;
  idCompany: string;
}

export interface CreatePermissionForUserType {
  email: string;
  password: string;
  document: string;
  name: string;
  idCompany: string;
  role: Role;
}
