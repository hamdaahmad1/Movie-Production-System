import {
    IsInt,
    IsOptional,
    IsString,
    Min,
    Max,
    IsIn,
  } from "class-validator";
  
  import { Transform } from "class-transformer";
  
  import { ApiPropertyOptional } from "@nestjs/swagger";
  
  
  export class MovieQueryDto {
  
    @ApiPropertyOptional({
      example: "Inception",
      description: "Search movies by title",
    })
    @IsOptional()
    @IsString()
    search?: string;
  
  
    @ApiPropertyOptional({
      example: "Action",
      description: "Filter movies by genre",
    })
    @IsOptional()
    @IsString()
    genre?: string;
  
  
    @ApiPropertyOptional({
      example: 1,
      description: "Filter movies by director ID",
    })
    @IsOptional()
    @Transform(({ value }) =>
      value ? Number(value) : undefined
    )
    @IsInt()
    directorId?: number;
  
  
    @ApiPropertyOptional({
      example: 2,
      description: "Filter movies by actor ID",
    })
    @IsOptional()
    @Transform(({ value }) =>
      value ? Number(value) : undefined
    )
    @IsInt()
    actorId?: number;
  
  
    @ApiPropertyOptional({
        example: 2010,
        description: "Filter movies by release year",
      })
      @IsOptional()
      @Transform(({ value }) =>
        value ? Number(value) : undefined
      )
      @IsInt()
      year?: number;
  
    @ApiPropertyOptional({
      example: "rating",
      description: "Field used for sorting",
      enum: [
        "title",
        "rating",
        "year",
      ],
    })
    @IsOptional()
    @IsString()
    sortBy?: string;
  
  
    @ApiPropertyOptional({
      example: "desc",
      description: "Sorting order",
      enum: [
        "asc",
        "desc",
      ],
    })
    @IsOptional()
    @IsIn([
      "asc",
      "desc",
    ])
    order?: "asc" | "desc";
  
  
    @ApiPropertyOptional({
      example: 1,
      description: "Page number for pagination",
      default: 1,
    })
    @IsOptional()
    @Transform(({ value }) =>
      value ? Number(value) : 1
    )
    @IsInt()
    @Min(1)
    page: number = 1;
  
  
    @ApiPropertyOptional({
      example: 10,
      description: "Number of movies per page",
      default: 10,
      maximum: 100,
    })
    @IsOptional()
    @Transform(({ value }) =>
      value ? Number(value) : 10
    )
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number = 10;
  }