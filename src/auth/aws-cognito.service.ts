import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool } from 'amazon-cognito-identity-js';
import { AuthLoginUserDto } from './dto/auth-login-user.dto';
import { AuthRegisterUserDto } from './dto/auth-register-user.dto';
import { AuthConfirmationEmailDto } from './dto/auth-confimation-email.dto';

@Injectable()
export class AwsCognitoService {
  private userPool: CognitoUserPool;

  constructor() {
    this.userPool = new CognitoUserPool({
      UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
      ClientId: process.env.AWS_COGNITO_CLIENT_ID,
    });
  }

  async registerUser(authRegisterUserDto: AuthRegisterUserDto) {
    const { name, email, password } = authRegisterUserDto;

    const signinPromise = new Promise((resolve, reject) => {
      this.userPool.signUp(
        email,
        password,
        [
          new CognitoUserAttribute({
            Name: 'name',
            Value: name,
          }),
        ],
        null,
        (err, result) => {
          if (!result) {
            reject(err);
          } else {
            resolve(result.user);
          }
        },
      );
    });

    try {
      await signinPromise
        .then((response) => {
          return response;
        })
        .catch((err) => {
          const e: Error = new Error(err.message);
          e.name = err.name;
          throw e;
        });
    } catch (error) {
      throw new BadRequestException(error.message, { cause: new Error(), description: error.name });
    }
  }

  async authenticateUser(authLoginUserDto: AuthLoginUserDto) {
    const { email, password } = authLoginUserDto;
    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const userCognito = new CognitoUser(userData);

    userCognito.associateSoftwareToken;

    const authenticateUserPromise = new Promise((resolve, reject) => {
      userCognito.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve({
            accessToken: result.getAccessToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken(),
          });
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });

    try {
      await authenticateUserPromise
        .then((response) => {
          return response;
        })
        .catch((err) => {
          const e: Error = new Error(err.message);
          e.name = err.name;
          throw e;
        });
    } catch (error) {
      throw new BadRequestException(error.message, { cause: new Error(), description: error.name });
    }
  }

  async authenticateConfimationEmail(authConfirmationEmailDto: AuthConfirmationEmailDto) {
    const userData = {
      Username: authConfirmationEmailDto.email,
      Pool: this.userPool,
    };

    const userCognito = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      userCognito.resendConfirmationCode((err, result) => {
        if (!result) {
          reject(err);
        } else {
          resolve(result.user);
        }
      });
    });
  }
}
