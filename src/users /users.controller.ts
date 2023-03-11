import { Body, Controller, Delete, Get, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';

import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateUserForCompanyDto,
  DeletePermissionUserDto,
  GetUserForIdDto,
  GetUsersForCompanyDto,
  UpdatePermissionUserDto,
  UpdateUserDto,
} from './dto/userDto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/user')
  @UsePipes(ValidationPipe)
  async getUser(@Query() getUserDto: GetUserForIdDto) {
    return this.usersService.getUserYourPermission(getUserDto);
  }
  @Get('/all')
  @UsePipes(ValidationPipe)
  async getAll(@Query() getCompanyDto: GetUsersForCompanyDto) {
    return this.usersService.getUsersByCompany(getCompanyDto);
  }

  @Post('/create')
  @UsePipes(ValidationPipe)
  async create(@Body() createUserForCompanyDto: CreateUserForCompanyDto) {
    return this.usersService.createUserForCompany(createUserForCompanyDto);
  }
  @Patch('/update')
  @UsePipes(ValidationPipe)
  async update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateDataUser(updateUserDto);
  }

  @Patch('/updatePermission')
  @UsePipes(ValidationPipe)
  async updatePermission(@Body() updatePermissionUserDto: UpdatePermissionUserDto) {
    return this.usersService.updatePermissionUser(updatePermissionUserDto);
  }

  @Delete('/deletePermission')
  @UsePipes(ValidationPipe)
  async delete(@Body() deletePermissionUserDto: DeletePermissionUserDto) {
    return this.usersService.deletePermissionUser(deletePermissionUserDto);
  }
}
