import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma.service';
import { AwsCognitoService } from 'src/auth/aws-cognito.service';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [UsersService, AwsCognitoService, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
