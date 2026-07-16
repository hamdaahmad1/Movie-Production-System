import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsEnum,
} from 'class-validator';

import { Transform } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

import { UserRole } from '../../users/dto/create-user.dto';

export class RegisterDto {
 
  @Transform(({ value }) => value?.trim())
  @ApiProperty({
    example: 'Hamda',
    description: 'User first name',
  })
  @IsString()
  @IsNotEmpty({
    message: 'First name is required',
  })
  @MinLength(2, {
    message: 'First name must be at least 2 characters long',
  })
  @MaxLength(30, {
    message: 'First name cannot exceed 30 characters',
  })
  @Matches(/^[A-Za-z ]+$/, {
    message: 'First name can only contain letters and spaces',
  })
  firstName: string;

 

  @Transform(({ value }) => value?.trim())
  @ApiProperty({
    example: 'Ahmad',
    description: 'User last name',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Last name is required',
  })
  @MinLength(2, {
    message: 'Last name must be at least 2 characters long',
  })
  @MaxLength(30, {
    message: 'Last name cannot exceed 30 characters',
  })
  @Matches(/^[A-Za-z ]+$/, {
    message: 'Last name can only contain letters and spaces',
  })
  lastName: string;

  
  @Transform(({ value }) => value?.trim())
  @ApiProperty({
    example: 'hamda_ahmad',
    description: 'Unique username',
  })
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

 

  @Transform(({ value }) => value?.trim())
  @ApiProperty({
    example: 'hamda@example.com',
    description: 'User email address',
  })
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

  
  @ApiProperty({
    example: 'Password123!',
    description:
      'Password must contain uppercase, lowercase, number and special character',
  })
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
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
    },
  )
  password: string;


  @ApiProperty({
    example: 'Password123!',
    description: 'Must match the password field',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Confirm password is required',
  })
  confirmPassword: string;

 
  @ApiProperty({
    example: 'VIEWER',
    enum: ['VIEWER', 'EDITOR'],
    description: 'Role selected during registration',
  })
  @IsEnum(UserRole, {
    message: 'Role must be VIEWER or EDITOR',
  })
  role: UserRole;
}