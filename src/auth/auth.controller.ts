import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AwsCognitoService } from './aws-cognito.service';
import { AuthLoginUserDto } from './dto/auth-login-user.dto';
import { AuthRegisterUserDto } from './dto/auth-register-user.dto';
import { AuthConfirmationEmailDto } from './dto/auth-confimation-email.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private awsCognitoService: AwsCognitoService) {}

  @Post('/register')
  async register(@Body() authRegisterUserDto: AuthRegisterUserDto) {
    return await this.awsCognitoService.registerUser(authRegisterUserDto);
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
  async login(@Body() authLoginUserDto: AuthLoginUserDto) {
    return await this.awsCognitoService.authenticateUser(authLoginUserDto);
  }

  @Post('/confimationEmail')
  @UsePipes(ValidationPipe)
  async confimationEmail(@Body() authConfirmationDto: AuthConfirmationEmailDto) {
    return await this.awsCognitoService.authenticateConfimationEmail(authConfirmationDto);
  }
}
