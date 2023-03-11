import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool } from 'amazon-cognito-identity-js';

import { CognitoToken } from './types/typesAuthCognito';
import { ChangePasswordDto, ConfirmPasswordDto, EmailDto, SignInDto } from './dto/auth.dto';

@Injectable()
export class AwsCognitoService {
  private userPool: CognitoUserPool;

  constructor() {
    this.userPool = new CognitoUserPool({
      UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
      ClientId: process.env.AWS_COGNITO_CLIENT_ID,
    });
  }

  async registerUser(signUp: { name: string; email: string; password: string }) {
    const { name, email, password } = signUp;

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

  async authenticateUser(signInDto: SignInDto) {
    const { email, password } = signInDto;
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

  async authenticateConfimationEmail(emailDto: EmailDto) {
    const userData = {
      Username: emailDto.email,
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

  async changeUserPassword(authChangePasswordUser: ChangePasswordDto) {
    const { email, currentPassword, newPassword } = authChangePasswordUser;

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

  async forgotUserPassword(emailDto: EmailDto) {
    const { email } = emailDto;

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

  async confirmUserPassword(confirmPassword: ConfirmPasswordDto) {
    const { email, confirmationCode, newPassword } = confirmPassword;

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
