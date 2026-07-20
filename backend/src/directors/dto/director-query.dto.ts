import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  Max,
} from "class-validator";

import { Type } from "class-transformer";

import { ApiPropertyOptional } from "@nestjs/swagger";

export class DirectorQueryDto {

  @ApiPropertyOptional({
    example: "Christopher",
    description: "Search director by name",
  })
  @IsOptional()
  @IsString()
  search?: string;


  @ApiPropertyOptional({
    example: 1970,
    description: "Filter directors by birth year",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  birthYear?: number;


  @ApiPropertyOptional({
    example: "name",
    description: "Sort field",
  })
  @IsOptional()
  @IsString()
  sortBy?: string;


  @ApiPropertyOptional({
    example: "desc",
    enum: ["asc", "desc"],
  })
  @IsOptional()
  @IsString()
  order?: "asc" | "desc";


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