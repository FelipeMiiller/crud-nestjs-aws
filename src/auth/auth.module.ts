import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { AwsCognitoService } from './aws-cognito.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AwsCognitoService],
})
export class AuthModule {}
