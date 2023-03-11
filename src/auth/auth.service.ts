import { BadRequestException, Injectable } from '@nestjs/common';
import { AwsCognitoService } from './aws-cognito.service';

import { PrismaService } from 'src/prisma.service';
import { SignInType, SignUpType } from './types/typesAuthUser';
import { Permission } from '@prisma/client';
import { UsersService } from 'src/users /users.service';
import { CognitoToken } from './types/typesAuthCognito';
import { UserType } from 'src/users /types/typesUser';

@Injectable()
export class AuthService {
  constructor(
    private awsCognitoService: AwsCognitoService,
    private prismaService: PrismaService,
    private usersService: UsersService,
  ) {}

  async signup(signUp: SignUpType): Promise<Permission> {
    const { name, email, password, documentCompany, document, nameCompany } = signUp;

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
            role: 'ADMIN',
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
              create: {
                email,
                status: true,
                name: nameCompany,
                document: documentCompany,
              },
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

  async signin(signIn: SignInType): Promise<{ user: UserType; token: CognitoToken }> {
    const { email, password } = signIn;

    try {
      const token: CognitoToken = await this.awsCognitoService.authenticateUser({ email, password });

      const user = await this.usersService.getUserYourPermissions({ email });

      return { user, token };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message, { cause: new Error(), description: error.name });
    }
  }
}
