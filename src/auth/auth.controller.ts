import { Body, Controller, Get, Post, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AwsCognitoService } from './aws-cognito.service';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto, ConfirmPasswordDto, EmailDto, SignInDto, SignUpDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { GoogleService } from './google.service';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(
    private awsCognitoService: AwsCognitoService,
    private authService: AuthService,
    private googleService: GoogleService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    return 'google';
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.googleService.googleLogin(req);
  }

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
