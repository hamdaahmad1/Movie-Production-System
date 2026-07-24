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
  IsNumber,
} from 'class-validator';

import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({
    example: 'Inception',
    description: 'Title of the movie',
    minLength: 2,
    maxLength: 150,
  })
  @Transform(({ value }) =>
    value?.trim().replace(/\s+/g, ' '),
  )
  @IsString()
  @IsNotEmpty({
    message: 'Title is required',
  })
  @MinLength(2, {
    message:
      'Title must be at least 2 characters long',
  })
  @MaxLength(150, {
    message:
      'Title cannot exceed 150 characters',
  })
  @Matches(/^[A-Za-z0-9\s:'.,!?()-]+$/, {
    message:
      'Title contains invalid characters',
  })
  title: string;

  @ApiProperty({
    example:
      'A skilled thief who steals secrets through dream-sharing technology is given a chance to have his criminal record erased.',
    description: 'Description of the movie',
    minLength: 20,
    maxLength: 2000,
  })
  @Transform(({ value }) =>
    value?.trim(),
  )
  @IsString()
  @IsNotEmpty({
    message: 'Description is required',
  })
  @MinLength(20, {
    message:
      'Description must be at least 20 characters long',
  })
  @MaxLength(2000, {
    message:
      'Description cannot exceed 2000 characters',
  })
  description: string;

  @ApiProperty({
    example: '2010-07-16',
    description:
      'Movie release date in ISO date format',
    format: 'date',
  })
  @IsDateString(
    {},
    {
      message:
        'Release date must be a valid date',
    },
  )
  releaseDate: string;

  @ApiProperty({
    example: 8.8,
    description:
      'Movie rating from 1 to 10',
    minimum: 1,
    maximum: 10,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1, {
    message:
      'Rating must be at least 1',
  })
  @Max(10, {
    message:
      'Rating cannot exceed 10',
  })
  rating: number;

  @ApiProperty({
    example: 148,
    description:
      'Movie duration in minutes',
    minimum: 30,
    maximum: 500,
  })
  @Type(() => Number)
  @IsInt({
    message:
      'Duration must be an integer',
  })
  @Min(30, {
    message:
      'Duration must be at least 30 minutes',
  })
  @Max(500, {
    message:
      'Duration cannot exceed 500 minutes',
  })
  duration: number;

  @ApiProperty({
    example: 'Sci-Fi',
    description: 'Movie genre',
  })
  @Transform(({ value }) =>
    value?.trim(),
  )
  @IsString()
  @IsNotEmpty({
    message: 'Genre is required',
  })
  @MinLength(3, {
    message:
      'Genre must be at least 3 characters long',
  })
  @MaxLength(50, {
    message:
      'Genre cannot exceed 50 characters',
  })
  @Matches(/^[A-Za-z\s-]+$/, {
    message:
      'Genre can only contain letters, spaces and hyphens',
  })
  genre: string;

  @ApiProperty({
    example: 'English',
    description:
      'Primary language of the movie',
  })
  @Transform(({ value }) =>
    value?.trim(),
  )
  @IsString()
  @IsNotEmpty({
    message: 'Language is required',
  })
  @MinLength(2, {
    message:
      'Language must be at least 2 characters long',
  })
  @MaxLength(30, {
    message:
      'Language cannot exceed 30 characters',
  })
  @Matches(/^[A-Za-z\s]+$/, {
    message:
      'Language can only contain letters and spaces',
  })
  language: string;


  @ApiProperty({
    example:
      'https://www.youtube.com/watch?v=YoHD9XEInc0',
    description: 'Trailer URL',
  })
  @IsNotEmpty({
    message:
      'Trailer URL is required',
  })
  @IsUrl(
    {},
    {
      message:
        'Trailer URL must be valid',
    },
  )
  @MaxLength(500)
  trailerId: string;

  @ApiProperty({
    example: 1,
    description:
      'ID of the movie director',
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt({
    message:
      'Director ID must be an integer',
  })
  @Min(1, {
    message:
      'Director ID must be greater than 0',
  })
  directorId: number;

  @ApiProperty({
    example: [1, 2, 3],
    description:
      'IDs of the actors appearing in the movie',
    type: [Number],
  })
  @Transform(({ value }) => {

    if (typeof value === 'string') {
      try {
        return JSON.parse(value).map(Number);
      } catch {
        return [];
      }
    }
  
    if (Array.isArray(value)) {
      return value.map(Number);
    }
  
    return [];
  
  })
  @IsArray({
    message: 'Actor IDs must be an array',
  })
  @ArrayNotEmpty({
    message: 'At least one actor is required',
  })
  @ArrayUnique({
    message: 'Duplicate actor IDs are not allowed',
  })
  @IsInt({
    each: true,
    message: 'Each actor ID must be an integer number',
  })
  actorIds: number[];


  
  posterPath: any;
}