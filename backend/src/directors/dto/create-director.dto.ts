import {
    IsString,
    IsNotEmpty,
    IsDateString,
    IsUrl,
    MinLength,
    MaxLength,
    Matches,
  } from 'class-validator';
  
  import { Transform } from 'class-transformer';
  
  export class CreateDirectorDto {
  
    @Transform(({ value }) => value?.trim().replace(/\s+/g, ' '))
    @IsString()
    @IsNotEmpty({ message: 'Name is required' })
    @MinLength(2, {
      message: 'Name must be at least 2 characters long',
    })
    @MaxLength(100, {
      message: 'Name cannot exceed 100 characters',
    })
    @Matches(/^[A-Za-z\s.'-]+$/, {
      message:
        "Name can only contain letters, spaces, apostrophes ('), hyphens (-), and periods (.)",
    })
    @Matches(/^(?!([A-Za-z])\1+$).*/, {
      message: 'Name cannot consist of the same repeated character',
    })
    name: string;
  
    @Transform(({ value }) => value?.trim())
    @IsString()
    @IsNotEmpty({ message: 'Nationality is required' })
    @MinLength(2, {
      message: 'Nationality must be at least 2 characters long',
    })
    @MaxLength(50, {
      message: 'Nationality cannot exceed 50 characters',
    })
    @Matches(/^[A-Za-z\s]+$/, {
      message: 'Nationality can only contain letters and spaces',
    })
    nationality: string;
  
    @Transform(({ value }) => value?.trim())
    @IsString()
    @IsNotEmpty({ message: 'Biography is required' })
    @MinLength(20, {
      message: 'Biography must be at least 20 characters long',
    })
    @MaxLength(1000, {
      message: 'Biography cannot exceed 1000 characters',
    })
    biography: string;
  
    @IsNotEmpty({ message: 'Image URL is required' })
    @IsUrl({}, { message: 'Image URL must be valid' })
    @MaxLength(500, {
      message: 'Image URL cannot exceed 500 characters',
    })
    imageUrl: string;
  
    @IsDateString({}, {
      message: 'Date of birth must be a valid date',
    })
    dob: string;
  }