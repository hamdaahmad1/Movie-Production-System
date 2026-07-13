import {
    IsString,
    IsNotEmpty,
    IsInt,
    Min,
    Max,
    IsArray,
    ArrayNotEmpty,
    ArrayUnique,
    IsUrl,
    IsDateString,
    MinLength,
    MaxLength,
    Matches,
  } from 'class-validator';
  import { Transform, Type } from 'class-transformer';
  
  export class CreateMovieDto {
  
    @Transform(({ value }) => value?.trim().replace(/\s+/g, ' '))
    @IsString()
    @IsNotEmpty({ message: 'Title is required' })
    @MinLength(2, {
      message: 'Title must be at least 2 characters long',
    })
    @MaxLength(150, {
      message: 'Title cannot exceed 150 characters',
    })
    @Matches(/^[A-Za-z0-9\s:'.,!?()-]+$/, {
      message: 'Title contains invalid characters',
    })
    title: string;
  
    @Transform(({ value }) => value?.trim())
    @IsString()
    @IsNotEmpty({ message: 'Description is required' })
    @MinLength(20, {
      message: 'Description must be at least 20 characters long',
    })
    @MaxLength(2000, {
      message: 'Description cannot exceed 2000 characters',
    })
    description: string;
  
    @IsDateString({}, {
      message: 'Release date must be a valid date',
    })
    releaseDate: string;
  
    @Type(() => Number)
    @IsInt({ message: 'Rating must be an integer' })
    @Min(1, {
      message: 'Rating must be at least 1',
    })
    @Max(10, {
      message: 'Rating cannot exceed 10',
    })
    rating: number;
  
    @Type(() => Number)
    @IsInt({ message: 'Duration must be an integer' })
    @Min(1, {
      message: 'Duration must be greater than 0',
    })
    @Max(500, {
      message: 'Duration cannot exceed 500 minutes',
    })
    duration: number;
  
    @Transform(({ value }) => value?.trim())
    @IsString()
    @IsNotEmpty({ message: 'Genre is required' })
    @MinLength(3)
    @MaxLength(50)
    @Matches(/^[A-Za-z\s-]+$/, {
      message: 'Genre can only contain letters and spaces',
    })
    genre: string;
  
    @Transform(({ value }) => value?.trim())
    @IsString()
    @IsNotEmpty({ message: 'Language is required' })
    @MinLength(2)
    @MaxLength(30)
    @Matches(/^[A-Za-z\s]+$/, {
      message: 'Language can only contain letters and spaces',
    })
    language: string;
  
    @IsNotEmpty({ message: 'Poster URL is required' })
    @IsUrl({}, {
      message: 'Poster URL must be valid',
    })
    @MaxLength(500)
    posterUrl: string;
  
    @IsNotEmpty({ message: 'Trailer URL is required' })
    @IsUrl({}, {
      message: 'Trailer URL must be valid',
    })
    @MaxLength(500)
    trailerId: string;
  
    @Type(() => Number)
    @IsInt({
      message: 'Director ID must be an integer',
    })
    @Min(1, {
      message: 'Director ID must be greater than 0',
    })
    directorId: number;
  
    @IsArray({
      message: 'Actor IDs must be an array',
    })
    @ArrayNotEmpty({
      message: 'At least one actor is required',
    })
    @ArrayUnique({
      message: 'Duplicate actor IDs are not allowed',
    })
    @Type(() => Number)
    actorIds: number[];
  }