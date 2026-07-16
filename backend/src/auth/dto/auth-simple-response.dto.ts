import { ApiProperty } from '@nestjs/swagger';

export class AvailabilityResponseDto {
  @ApiProperty({
    example: true,
    description: 'Whether the username or email is available',
  })
  available: boolean;

  @ApiProperty({
    example: 'Username is available.',
    description: 'Availability result message',
  })
  message: string;
}

export class LogoutResponseDto {
  @ApiProperty({
    example: 'Logged out successfully.',
  })
  message: string;
}