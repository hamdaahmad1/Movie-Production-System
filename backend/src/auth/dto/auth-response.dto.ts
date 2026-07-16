import { ApiProperty } from '@nestjs/swagger';

export class AuthUserResponseDto {
  @ApiProperty({
    example: 8,
    description: 'Unique user ID',
  })
  id: number;

  @ApiProperty({
    example: 'adminuser22',
    description: 'Unique username',
  })
  username: string;

  @ApiProperty({
    example: 'admin57@gmail.com',
    description: 'User email address',
  })
  email: string;

  @ApiProperty({
    example: 'Admin',
    description: 'User first name',
  })
  firstName: string;

  @ApiProperty({
    example: 'User',
    description: 'User last name',
  })
  lastName: string;

  @ApiProperty({
    example: 'ADMIN',
    enum: ['ADMIN', 'EDITOR', 'VIEWER'],
    description: 'User role',
  })
  role: string;
}

export class AuthResponseDto {
  @ApiProperty({
    example: 'Login successful.',
    description: 'Operation result message',
  })
  message: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token used to authenticate protected requests',
  })
  access_token: string;

  @ApiProperty({
    type: AuthUserResponseDto,
  })
  user: AuthUserResponseDto;
}