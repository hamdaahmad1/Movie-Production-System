import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponseDto {
  @ApiProperty({
    example: 8,
  })
  id: number;

  @ApiProperty({
    example: 'adminuser22',
  })
  username: string;

  @ApiProperty({
    example: 'admin57@gmail.com',
  })
  email: string;

  @ApiProperty({
    example: 'Admin',
  })
  firstName: string;

  @ApiProperty({
    example: 'User',
  })
  lastName: string;

  @ApiProperty({
    example: 'ADMIN',
    enum: ['ADMIN', 'EDITOR', 'VIEWER'],
  })
  role: string;
}