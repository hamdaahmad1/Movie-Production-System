import {
    IsInt,
    IsOptional,
    IsString,
    IsEnum,
    Min,
    Max,
  } from "class-validator";
  
  import { Type } from "class-transformer";
  
  import { ApiPropertyOptional } from "@nestjs/swagger";
  
  import { UserRole } from "./create-user.dto";
  
  export class UserQueryDto {
    @ApiPropertyOptional({
      example: "hamda",
      description: "Search by username, first name, last name or email",
    })
    @IsOptional()
    @IsString()
    search?: string;
  
    @ApiPropertyOptional({
      enum: UserRole,
      description: "Filter by role",
    })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;
  
    @ApiPropertyOptional({
      example: "username",
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
      example: 5,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number = 10;
  }