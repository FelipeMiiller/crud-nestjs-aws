import { BadRequestException, Injectable } from '@nestjs/common';
import { Permission } from '@prisma/client';
import { AwsCognitoService } from 'src/auth/aws-cognito.service';
import { PrismaService } from 'src/prisma.service';
import {
  CreateUserForCompanyDto,
  DeletePermissionUserDto,
  GetUserForEmailDto,
  GetUserForIdDto,
  GetUsersForCompanyDto,
  UpdatePermissionUserDto,
  UpdateUserDto,
} from './dto/userDto';
import { PermissionType, UserType, UserYourPermissionsType } from './types/typesUser';

@Injectable()
export class UsersService {
  constructor(private awsCognitoService: AwsCognitoService, private prismaService: PrismaService) {}

  async createUserForCompany(dataForCreate: CreateUserForCompanyDto): Promise<Permission> {
    const { name, email, password, document, idCompany, role } = dataForCreate;

    try {
      await this.awsCognitoService.registerUser({ email, password, name }).catch((err) => {
        if (err.response.error !== 'UsernameExistsException') {
          const e: Error = new Error(err.message);
          e.name = err.error;
          throw e;
        }
      });

      const permission = await this.prismaService.permission
        .create({
          data: {
            role,
            status: true,
            user: {
              connectOrCreate: {
                where: {
                  email: email,
                },
                create: {
                  email,
                  name,
                  document,
                },
              },
            },
            company: {
              connect: { id: idCompany },
            },
          },
        })
        .catch((err) => {
          console.log(err);
          const e: Error = new Error(err.meta.target);
          e.name = err.code;
          throw e;
        });

      return permission;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message, { cause: new Error(), description: error.name });
    }
  }

  async getUserYourPermissions(userData: GetUserForEmailDto): Promise<UserYourPermissionsType> {
    const { email } = userData;
    try {
      let userDB: any;

      await this.prismaService.user
        .findUnique({
          where: { email },
          include: { permissions: { include: { company: true } } },
        })
        .then((resp) => {
          userDB = resp;
        })
        .catch((err) => {
          console.log(err);
          const e: Error = new Error(err.meta.target);
          e.name = err.code;
          throw e;
        });

      const userToSend: UserYourPermissionsType = {
        id: userDB.id,
        email: userDB.email,
        name: userDB.name,
        document: userDB.document,
        createdAt: userDB.createdAt,
        updatedAt: userDB.updatedAt,
        permissions: userDB.permissions.map((permission) => {
          return {
            permission: {
              id: permission.id,
              role: permission.role,
              status: permission.status,
              createdAt: permission.createdAt,
              updatedAt: permission.updatedAt,
            },
            company: {
              id: permission.company.id,
              email: permission.company.email,
              name: permission.company.name,
              document: permission.company.document,
              status: permission.company.status,
              createdAt: permission.company.created,
              updatedAt: permission.company.updated,
            },
          };
        }),
      };

      return userToSend;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message, { cause: new Error(), description: error.name });
    }
  }

  async getUserYourPermission(userData: GetUserForIdDto): Promise<UserType> {
    const { idCompany, idUser } = userData;
    try {
      let userDB: any;

      await this.prismaService.user
        .findFirst({
          where: { id: idUser, permissions: { some: { companyId: idCompany } } },
          include: { permissions: { include: { company: true } } },
        })
        .then((resp) => {
          userDB = resp;
        })
        .catch((err) => {
          console.log(err);
          const e: Error = new Error(err.meta.target);
          e.name = err.code;
          throw e;
        });

      const userToSend: UserType = {
        id: userDB.id,
        email: userDB.email,
        name: userDB.name,
        document: userDB.document,
        createdAt: userDB.createdAt,
        updatedAt: userDB.updatedAt,
        permission: userDB.permissions.map((permission) => {
          return {
            permission: {
              id: permission.id,
              role: permission.role,
              status: permission.status,
              createdAt: permission.createdAt,
              updatedAt: permission.updatedAt,
            },
            company: {
              id: permission.company.id,
              email: permission.company.email,
              name: permission.company.name,
              document: permission.company.document,
              status: permission.company.status,
              createdAt: permission.company.created,
              updatedAt: permission.company.updated,
            },
          };
        }),
      };

      return userToSend;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message, { cause: new Error(), description: error.name });
    }
  }

  async getUsersByCompany(companyData: GetUsersForCompanyDto): Promise<UserType[]> {
    const { idCompany } = companyData;
    try {
      let permissionsDB: any;

      await this.prismaService.permission
        .findMany({
          where: { companyId: idCompany },
          include: { user: true },
        })
        .then((resp) => {
          permissionsDB = resp;
        })
        .catch((err) => {
          console.log(err);
          const e: Error = new Error(err.meta.target);
          e.name = err.code;
          throw e;
        });

      const usersToSend: UserType[] = permissionsDB.map((permissionDB) => {
        return {
          id: permissionDB.user.id,
          email: permissionDB.user.email,
          name: permissionDB.user.name,
          document: permissionDB.user.document,
          createdAt: permissionDB.user.createdAt,
          updatedAt: permissionDB.user.updatedAt,
          permission: {
            id: permissionDB.id,
            role: permissionDB.role,
            status: permissionDB.status,
            createdAt: permissionDB.createdAt,
            updatedAt: permissionDB.updatedAt,
          },
        };
      });

      return usersToSend;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message, { cause: new Error(), description: error.name });
    }
  }

  async updateDataUser(userData: UpdateUserDto): Promise<UserType> {
    const { id, name, document } = userData;

    try {
      let userDB: any;

      await this.prismaService.user
        .update({
          where: { id },
          data: { document, name },
        })
        .then((resp) => {
          userDB = resp;
        })
        .catch((err) => {
          console.log(err);
          const e: Error = new Error(err.meta.target);
          e.name = err.code;
          throw e;
        });

      const userToSend: UserType = {
        id: userDB.id,
        email: userDB.email,
        name: userDB.name,
        document: userDB.document,
        createdAt: userDB.createdAt,
        updatedAt: userDB.updatedAt,
      };

      return userToSend;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message, { cause: new Error(), description: error.name });
    }
  }

  async updatePermissionUser(updatePermissionUserDto: UpdatePermissionUserDto): Promise<UserType> {
    const { idCompany, idUser, role, status } = updatePermissionUserDto;

    try {
      let userDB: any;

      await this.prismaService.permission
        .updateMany({
          where: { companyId: idCompany, userId: idUser },
          data: { role, status },
        })
        .then((resp) => {
          userDB = resp;
        })
        .catch((err) => {
          console.log(err);
          const e: Error = new Error(err.meta.target);
          e.name = err.code;
          throw e;
        });

      const userToSend: UserType = {
        id: userDB.id,
        email: userDB.email,
        name: userDB.name,
        document: userDB.document,
        createdAt: userDB.createdAt,
        updatedAt: userDB.updatedAt,
        permission: userDB.permissions.map((permission) => {
          return {
            permission: {
              id: permission.id,
              role: permission.role,
              status: permission.status,
              createdAt: permission.createdAt,
              updatedAt: permission.updatedAt,
            },
            company: {
              id: permission.company.id,
              email: permission.company.email,
              name: permission.company.name,
              document: permission.company.document,
              status: permission.company.status,
              createdAt: permission.company.created,
              updatedAt: permission.company.updated,
            },
          };
        }),
      };

      return userToSend;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message, { cause: new Error(), description: error.name });
    }
  }

  async deletePermissionUser(deletePermissionUser: DeletePermissionUserDto): Promise<any> {
    const { idPermission } = deletePermissionUser;

    try {
      const permissionDB = await this.prismaService.permission.delete({
        where: { id: idPermission },
      });
      if (permissionDB) {
        return 'Permission deleted successfully';
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message, { cause: new Error(), description: error.name });
    }
  }
}
