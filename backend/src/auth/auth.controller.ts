import {
  Controller,
  Body,
  Post,
  Get,
  Query,
  Res,
  Req,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import type { Response } from 'express';
import type { Request } from 'express';
import { Public } from './decorators/public.decorator';



@ApiTags('Auth')
@Controller('auth')
export class AuthController {


  constructor(
    private readonly authService: AuthService,
  ) {}



  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a new user account, sets an HTTP-only authentication cookie, and returns a JWT access token.',
  })
  @ApiResponse({
    status: 201,
    description: 'Registration successful.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid data, passwords do not match, duplicate username/email, or invalid role.',
  })
  register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.register(dto, res);
  }




  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'Login a user',
    description:
      'Authenticates a user using a username or email and password. Returns a JWT access token and sets an HTTP-only authentication cookie.',
  })
  @ApiResponse({
    status: 201,
    description: 'Login successful.',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid username/email or password.',
  })
  login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(dto, res);
  }




  @Public()
  @Get('check-username')
  @ApiOperation({
    summary: 'Check username availability',
    description:
      'Checks whether a username is already registered in the system.',
  })
  @ApiQuery({
    name: 'username',
    example: 'hamda_ahmad',
    description: 'Username to check',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Username availability result.',
  })
  checkUsername(
    @Query('username') username: string,
  ) {
    return this.authService.checkUsername(username);
  }




  @Public()
  @Get('check-email')
  @ApiOperation({
    summary: 'Check email availability',
    description:
      'Checks whether an email address is already registered in the system.',
  })
  @ApiQuery({
    name: 'email',
    example: 'hamda@example.com',
    description: 'Email address to check',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Email availability result.',
  })
  checkEmail(
    @Query('email') email: string,
  ) {
    return this.authService.checkEmail(email);
  }




  @Post('logout')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Logout the current user',
    description:
      'Clears the authentication cookie and logs the user out.',
  })
  @ApiResponse({
    status: 201,
    description: 'User logged out successfully.',
  })
  logout(
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logout(res);
  }




  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get current user profile',
    description:
      'Returns the profile of the currently authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Authentication required. JWT token is missing, invalid, or expired.',
  })
  getProfile(
    @Req() req: Request,
  ) {
    return this.authService.getProfile(req.user.id);
  }

}