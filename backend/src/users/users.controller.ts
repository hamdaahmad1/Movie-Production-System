import {
    Body,
    Controller,
    Post,
    UseGuards,
  } from '@nestjs/common';
  
  import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags,
  } from '@nestjs/swagger';
  
  import { CreateUserDto } from './dto/create-user.dto';
  import { UsersService } from './users.service';
  
  import { RolesGuard } from 'src/auth/guards/roles.guard';
  import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
  import { Roles } from 'src/auth/decorators/roles.decorator';
  
  @ApiTags('Users')
  @Controller('users')
  export class UsersController {
    constructor(
      private readonly usersService: UsersService,
    ) {}
  
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
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
    @ApiResponse({
      status: 401,
      description:
        'Unauthorized. JWT token is missing or invalid.',
    })
    @ApiResponse({
      status: 403,
      description:
        'Forbidden. Only ADMIN users can create users.',
    })
    create(
      @Body() createUserDto: CreateUserDto,
    ) {
      return this.usersService.create(
        createUserDto,
      );
    }
  }

