import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { AwsCognitoService } from './aws-cognito.service';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto, ConfirmPasswordDto, EmailDto, SignInDto, SignUpDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(private awsCognitoService: AwsCognitoService, private authService: AuthService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe)
  async register(@Body() signUp: SignUpDto) {
    return this.authService.signup(signUp);
  }

  @Get('/signin')
  @UsePipes(ValidationPipe)
  async signin(@Query() signInDto: SignInDto) {
    return this.authService.signin(signInDto);
  }

  @Post('/confimation-email')
  @UsePipes(ValidationPipe)
  async confimationEmail(@Body() authConfirmation: EmailDto) {
    return this.awsCognitoService.authenticateConfimationEmail(authConfirmation);
  }

  @Post('/change-password')
  @UsePipes(ValidationPipe)
  async changePassword(@Body() changePassword: ChangePasswordDto) {
    return this.awsCognitoService.changeUserPassword(changePassword);
  }

  @Post('/forgot-password')
  @UsePipes(ValidationPipe)
  async forgotPassword(@Body() authForgotPassword: EmailDto) {
    return await this.awsCognitoService.forgotUserPassword(authForgotPassword);
  }

  @Post('/confirm-password')
  @UsePipes(ValidationPipe)
  async confirmPassword(@Body() confirmPassword: ConfirmPasswordDto) {
    return await this.awsCognitoService.confirmUserPassword(confirmPassword);
  }
}
