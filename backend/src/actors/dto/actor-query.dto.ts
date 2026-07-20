import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  Max,
} from 'class-validator';

import { Type } from 'class-transformer';

import { ApiPropertyOptional } from '@nestjs/swagger';


export class ActorQueryDto {

  @ApiPropertyOptional({
    example: 'Leonardo',
    description: 'Search actor by name',
  })
  @IsOptional()
  @IsString()
  search?: string;


  @ApiPropertyOptional({
    example: 1990,
    description: 'Filter actors by birth year',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  birthYear?: number;


  @ApiPropertyOptional({
    example: 'name',
    description: 'Sort field',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;


  @ApiPropertyOptional({
    example: 'desc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc';


  @ApiPropertyOptional({
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;


  @ApiPropertyOptional({
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;
}