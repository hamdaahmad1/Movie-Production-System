import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
}

export class CreateUserDto {
  @ApiProperty({
    example: 'adminuser22',
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

  @ApiProperty({
    example: 'admin@example.com',
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
    example: 'Admin@123',
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
        'Password must contain uppercase, lowercase, number and special character',
    },
  )
  password: string;

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

  @ApiProperty({
    example: UserRole.VIEWER,
    enum: UserRole,
    description: 'User role',
  })
  @IsEnum(UserRole, {
    message: 'Role must be ADMIN, EDITOR or VIEWER',
  })
  role: UserRole;
}