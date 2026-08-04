import {
   
    BadRequestException,
    Injectable,
    UnauthorizedException,
    Logger
  } from '@nestjs/common';
  
  import * as bcrypt from 'bcrypt';
  import type { Response } from 'express';

  import { JwtService } from '@nestjs/jwt';
  
  import { UsersService } from '../users/users.service';
  import { UserRole } from '../users/dto/create-user.dto';
  import { RegisterDto } from './dto/register.dto';
  import { LoginDto } from './dto/login.dto';
  
  @Injectable()
  export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
      private readonly usersService: UsersService,
      private readonly jwtService: JwtService,
    ) {}

    private async generateAuthResponse(
  user: {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  },
  message: string,
  res: Response,
) {
  const payload = {
    sub: user.id,
    username: user.username,
    role: user.role,
  };

  const accessToken = await this.jwtService.signAsync(payload);

  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: true,        // required since you're on HTTPS now
    sameSite: 'none',    // required for cross-site (Vercel <-> Railway) cookies
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  });

  return {
    message,
    access_token: accessToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  };
}
    
  
    async register(dto: RegisterDto, res:Response) 
    {
      if (dto.password !== dto.confirmPassword) {
        throw new BadRequestException(
          'Password and Confirm Password do not match.',
        );
      }
      if (
        dto.firstName.trim().toLowerCase() ===
        dto.lastName.trim().toLowerCase()
      ) {
        throw new BadRequestException(
          'First name and last name cannot be the same.',
        );
      }
      const existingUsername = await this.usersService.findByUsername(
        dto.username,
      );
      
      if (existingUsername) {
        throw new BadRequestException(
          'Username already exists.',
        );
      }
      const existingEmail = await this.usersService.findByEmail(
        dto.email,
      );
      
      if (existingEmail) {
        throw new BadRequestException(
          'Email already exists.',
        );
      }
    

      
      const user = await this.usersService.create({
        username: dto.username,
        email: dto.email,
        password: dto.password,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: UserRole.VIEWER,
      });

      this.logger.log("User registered successfully:", user.username);



      return {
        message: 'Registration successful. Please log in.',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      };

    
    }
  
    async login(loginDto: LoginDto,res: Response)
    {
      const user =
        await this.usersService.findByUsernameOrEmail(
          loginDto.login,
        );
  
  
      if (!user) {
        this.logger.warn("User not found for login:", loginDto.login);
        
        throw new UnauthorizedException(
          'Invalid username/email or password',
        );
      }
  
      const isPasswordCorrect =
        await bcrypt.compare(
          loginDto.password,
          user.password,
        );
       

      if (!isPasswordCorrect) {
        this.logger.warn("Incorrect password for user:", loginDto.login);

        throw new UnauthorizedException(
          'Invalid username/email or password',
        );
      }
      this.logger.log("User logged in successfully:", user.username);


      return this.generateAuthResponse(
        user,
        'Login successful.',
        res,
      );
    }
    async checkUsername(username: string) {
      const exists =
        await this.usersService.existsByUsername(username);

        this.logger.debug("Checking username availability:", username, "Exists:", exists);
    
      return {
        available: !exists,
        message: exists
          ? 'Username already exists.'
          : 'Username is available.',
      };
    }
    async checkEmail(email: string) {
      const exists =
        await this.usersService.existsByEmail(email);

        this.logger.debug("Checking email availability:", email, "Exists:", exists);
    
      return {
        available: !exists,
        message: exists
          ? 'Email already exists.'
          : 'Email is available.',
      };
    }

    async logout(res: Response) {
      res.clearCookie('access_token');

      this.logger.log("User logged out successfully.");
    
      return {
        message: 'Logged out successfully.',
      };
    }

    async getProfile(id: number) {
      const user = await this.usersService.findOne(id);

      if (!user) {

        this.logger.warn("User not found for profile retrieval:", id);
        throw new BadRequestException('User not found.');

        
      }
      this.logger.debug("Retrieved user profile:", user);
    
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      };
    }
  }