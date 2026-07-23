import {
  IsString,
  IsNotEmpty,
  IsDateString,
  MinLength,
  MaxLength,
  Matches,
  IsUrl,
  IsOptional,
} from 'class-validator';

import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDirectorDto {
  @ApiProperty({
    example: 'Christopher Nolan',
    description:
      'Full name of the director. Can contain letters, spaces, apostrophes, hyphens, and periods.',
    minLength: 2,
    maxLength: 100,
  })
  @Transform(({ value }) =>
    value?.trim().replace(/\s+/g, ' '),
  )
  @IsString()
  @IsNotEmpty({
    message: 'Name is required',
  })
  @MinLength(2, {
    message:
      'Name must be at least 2 characters long',
  })
  @MaxLength(100, {
    message:
      'Name cannot exceed 100 characters',
  })
  @Matches(/^[A-Za-z\s.'-]+$/, {
    message:
      "Name can only contain letters, spaces, apostrophes ('), hyphens (-), and periods (.)",
  })
  @Matches(/^(?!([A-Za-z])\1+$).*/, {
    message:
      'Name cannot consist of the same repeated character',
  })
  name: string;

  @ApiProperty({
    example: 'British-American',
    description:
      'Nationality of the director.',
    minLength: 2,
    maxLength: 50,
  })
  @Transform(({ value }) =>
    value?.trim(),
  )
  @IsString()
  @IsNotEmpty({
    message:
      'Nationality is required',
  })
  @MinLength(2, {
    message:
      'Nationality must be at least 2 characters long',
  })
  @MaxLength(50, {
    message:
      'Nationality cannot exceed 50 characters',
  })
  @Matches(/^[A-Za-z\s]+$/, {
    message:
      'Nationality can only contain letters and spaces',
  })
  nationality: string;

  @ApiProperty({
    example:
      'Christopher Nolan is a British-American filmmaker known for directing complex and visually ambitious films.',
    description:
      'Biography of the director.',
    minLength: 20,
    maxLength: 1000,
  })
  @Transform(({ value }) =>
    value?.trim(),
  )
  @IsString()
  @IsNotEmpty({
    message:
      'Biography is required',
  })
  @MinLength(20, {
    message:
      'Biography must be at least 20 characters long',
  })
  @MaxLength(1000, {
    message:
      'Biography cannot exceed 1000 characters',
  })
  biography: string;

  @ApiProperty({
    example: '1970-07-30',
    description:
      'Date of birth of the director in ISO 8601 date format.',
    format: 'date',
  })
  @IsDateString(
    {},
    {
      message:
        'Date of birth must be a valid date',
    },
  )
  dob: string;
  imagePath: any;


}