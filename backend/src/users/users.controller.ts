import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';


@ApiTags('Users')
@Controller('users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class UsersController {

  constructor(
    private readonly usersService: UsersService,
  ) {}



  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description:
      'Creates a new user account. Only ADMIN users are allowed to create users.',
  })
  @ApiBody({
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid user data.',
  })
  create(
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(
      createUserDto,
    );
  }


  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description:
      'Returns all users. Only ADMIN users can access this endpoint.',
  })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully.',
  })
  findAll() {
    return this.usersService.findAll();
  }


  @Get(':id')
  @ApiOperation({
    summary: 'Get user by id',
    description:
      'Returns a single user by id.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  findOne(
    @Param('id') id: string,
  ) {
    return this.usersService.findOne(
      Number(id),
    );
  }


  @Patch(':id')
  @ApiOperation({
    summary: 'Update user',
    description:
      'Updates user information. Only ADMIN users can update users.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiBody({
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(
      Number(id),
      updateUserDto,
    );
  }


  @Delete(':id')
  @ApiOperation({
    summary: 'Delete user',
    description:
      'Deletes a user. Only ADMIN users can delete users.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  remove(
    @Param('id') id: string,
  ) {
    return this.usersService.remove(
      Number(id),
    );
  }

}