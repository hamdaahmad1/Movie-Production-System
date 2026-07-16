import {
    IsNotEmpty,
    IsString,
    MinLength,
    MaxLength,
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';



  
  export class LoginDto 
  {

    @ApiProperty({
      example: 'adminuser22',
      description: 'Username or email address',
    })
    @IsString({ message: 'Email or Username must be a string' })
    @IsNotEmpty({ message: 'Email or Username is required' })
    @MinLength(3, {
      message: 'Email or Username must be at least 3 characters long',
    })
    @MaxLength(30, {
      message: 'Email or Username cannot exceed 30 characters',
    })
    login: string;
  

    @ApiProperty({
      example: 'Admin@123',
      description: 'User password',
    })
    @IsString({ message: 'Password must be a string' })
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(8, {
      message: 'Password must be at least 8 characters long',
    })
    @MaxLength(32, {
      message: 'Password cannot exceed 32 characters',
    })
    password: string;
  }