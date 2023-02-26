import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool } from 'amazon-cognito-identity-js';
import { AuthLoginUserDto } from './dto/auth-login-user.dto';
import { AuthRegisterUserDto } from './dto/auth-register-user.dto';
import { AuthEmailDto } from './dto/auth-email.dto';
import { CognitoToken } from './types/typesAuthCognito';
import { AuthChangePasswordUserDto } from './dto/auth-change-password-user.dto';
import { AuthConfirmPasswordUserDto } from './dto/auth-confirm-password-user.dto';

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
      let registerResponse: CognitoUser;
      await signinPromise
        .then((response: CognitoUser) => {
          registerResponse = response;
        })
        .catch((err) => {
          const e: Error = new Error(err.message);
          e.name = err.name;
          throw e;
        });

      return registerResponse;
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
      let authenticateUserResponse: CognitoToken;
      await authenticateUserPromise
        .then((response: CognitoToken) => {
          authenticateUserResponse = response;
        })
        .catch((err) => {
          const e: Error = new Error(err.message);
          e.name = err.name;
          throw e;
        });

      return authenticateUserResponse;
    } catch (error) {
      throw new BadRequestException(error.message, { cause: new Error(), description: error.name });
    }
  }

  async authenticateConfimationEmail(AuthEmailDto: AuthEmailDto) {
    const userData = {
      Username: AuthEmailDto.email,
      Pool: this.userPool,
    };
    const userCognito = new CognitoUser(userData);

    const confimationEmail = new Promise((resolve, reject) => {
      userCognito.resendConfirmationCode((err, result) => {
        if (!result) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    try {
      let confimationEmailReponse: any;
      await confimationEmail
        .then((response) => {
          confimationEmailReponse = response;
        })
        .catch((err) => {
          const e: Error = new Error(err.message);
          e.name = err.name;
          throw e;
        });
      return confimationEmailReponse;
    } catch (error) {
      throw new BadRequestException(error.message, { cause: new Error(), description: error.name });
    }
  }

  async changeUserPassword(authChangePasswordUserDto: AuthChangePasswordUserDto) {
    const { email, currentPassword, newPassword } = authChangePasswordUserDto;

    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: currentPassword,
    });

    const userCognito = new CognitoUser(userData);

    const changePassword = new Promise((resolve, reject) => {
      userCognito.authenticateUser(authenticationDetails, {
        onSuccess: () => {
          userCognito.changePassword(currentPassword, newPassword, (err, result) => {
            if (err) {
              reject(err);
            }
            resolve(result);
          });
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });

    try {
      let changePasswordReponse: any;
      await changePassword
        .then((response) => {
          changePasswordReponse = response;
        })
        .catch((err) => {
          const e: Error = new Error(err.message);
          e.name = err.name;
          throw e;
        });
      return changePasswordReponse;
    } catch (error) {
      throw new BadRequestException(error.message, { cause: new Error(), description: error.name });
    }
  }

  async forgotUserPassword(authForgotPasswordUserDto: AuthEmailDto) {
    const { email } = authForgotPasswordUserDto;

    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const userCognito = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      userCognito.forgotPassword({
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  async confirmUserPassword(authConfirmPasswordUserDto: AuthConfirmPasswordUserDto) {
    const { email, confirmationCode, newPassword } = authConfirmPasswordUserDto;

    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const userCognito = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      userCognito.confirmPassword(confirmationCode, newPassword, {
        onSuccess: () => {
          resolve({ status: 'success' });
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }
}
