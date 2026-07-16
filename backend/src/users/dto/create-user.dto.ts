import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    MinLength,
  } from 'class-validator';
  
  export enum UserRole {
    ADMIN = 'ADMIN',
    EDITOR = 'EDITOR',
    VIEWER = 'VIEWER',
  }
  
  export class CreateUserDto {
    @IsString()
    @IsNotEmpty({
      message: 'Username is required',
    })
    @MinLength(4, {
      message: 'Username must be at least 4 characters long',
    })
    @MaxLength(20, {
      message: 'Username cannot exceed 20 characters',
    })
    @Matches(/^[a-zA-Z0-9_]+$/, {
      message:
        'Username can only contain letters, numbers and underscores',
    })
    username: string;
  
    @IsEmail(
      {},
      {
        message: 'Email must be valid',
      },
    )
    @IsNotEmpty({
      message: 'Email is required',
    })
    @MaxLength(100, {
      message: 'Email cannot exceed 100 characters',
    })
    email: string;
  
    @IsString()
    @IsNotEmpty({
      message: 'Password is required',
    })
    @MinLength(8, {
      message: 'Password must be at least 8 characters long',
    })
    @MaxLength(32, {
      message: 'Password cannot exceed 32 characters',
    })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/, {
      message:
        'Password must contain uppercase, lowercase, number and special character',
    })
    password: string;
  
    @IsString()
    @IsNotEmpty({
      message: 'First name is required',
    })
    @MinLength(2)
    @MaxLength(30)
    @Matches(/^[A-Za-z ]+$/, {
      message: 'First name can only contain letters and spaces',
    })
    firstName: string;
  
    @IsString()
    @IsNotEmpty({
      message: 'Last name is required',
    })
    @MinLength(2)
    @MaxLength(30)
    @Matches(/^[A-Za-z ]+$/, {
      message: 'Last name can only contain letters and spaces',
    })
    lastName: string;
  
    @IsEnum(UserRole, {
      message: 'Role must be ADMIN, EDITOR or VIEWER',
    })
    role: UserRole;
  }