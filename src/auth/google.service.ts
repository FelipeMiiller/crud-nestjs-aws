import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users /users.service';

@Injectable()
export class GoogleService {
  constructor(private usersService: UsersService) {}

  async googleLogin(req) {
    try {
      if (!req.user) {
        throw new Error('No user from google');
      } else {
        const data = await this.usersService.getUserYourPermissions({ email: req.user.email });
        return { user: { ...data, picture: req.user.picture }, token: req.user.accessToken };
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message, { cause: new Error(), description: error.name });
    }
  }
}
