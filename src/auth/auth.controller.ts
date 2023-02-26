import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AwsCognitoService } from './aws-cognito.service';
import { AuthLoginUserDto } from './dto/auth-login-user.dto';
import { AuthRegisterUserDto } from './dto/auth-register-user.dto';
import { AuthEmailDto } from './dto/auth-email.dto';
import { AuthChangePasswordUserDto } from './dto/auth-change-password-user.dto';
import { AuthConfirmPasswordUserDto } from './dto/auth-confirm-password-user.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private awsCognitoService: AwsCognitoService) {}

  @Post('/register')
  async register(@Body() authRegisterUserDto: AuthRegisterUserDto) {
    return this.awsCognitoService.registerUser(authRegisterUserDto);
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
  async login(@Body() authLoginUserDto: AuthLoginUserDto) {
    return this.awsCognitoService.authenticateUser(authLoginUserDto);
  }

  @Post('/confimation-email')
  @UsePipes(ValidationPipe)
  async confimationEmail(@Body() authConfirmationDto: AuthEmailDto) {
    return this.awsCognitoService.authenticateConfimationEmail(authConfirmationDto);
  }

  @Post('/change-password')
  @UsePipes(ValidationPipe)
  async changePassword(@Body() authChangePasswordUserDto: AuthChangePasswordUserDto) {
    return this.awsCognitoService.changeUserPassword(authChangePasswordUserDto);
  }

  @Post('/forgot-password')
  @UsePipes(ValidationPipe)
  async forgotPassword(@Body() authForgotPasswordUserDto: AuthEmailDto) {
    return await this.awsCognitoService.forgotUserPassword(authForgotPasswordUserDto);
  }

  @Post('/confirm-password')
  @UsePipes(ValidationPipe)
  async confirmPassword(@Body() authConfirmPasswordUserDto: AuthConfirmPasswordUserDto) {
    return await this.awsCognitoService.confirmUserPassword(authConfirmPasswordUserDto);
  }
}
