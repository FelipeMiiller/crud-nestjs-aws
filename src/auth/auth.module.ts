import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { AwsCognitoService } from './aws-cognito.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [AuthController],
  providers: [AwsCognitoService, JwtStrategy],
})
export class AuthModule {}
