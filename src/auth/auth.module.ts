import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { AwsCognitoService } from './aws-cognito.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users /users.service';
import { GoogleService } from './google.service';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [AuthController],
  providers: [AuthService, AwsCognitoService, JwtStrategy, GoogleStrategy, PrismaService, UsersService, GoogleService],
  exports: [AwsCognitoService],
})
export class AuthModule {}
