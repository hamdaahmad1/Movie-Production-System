import {
    IsInt,
    IsOptional,
    IsString,
    Max,
    Min,
   } from "class-validator";
   
   import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
   
   
   export class CreateReviewDto {
   
   
   @ApiProperty({
    example:5,
    description:"Movie rating from 1 to 5"
   })
   @IsInt()
   @Min(1)
   @Max(5)
   rating:number;
   
   
   
   @ApiPropertyOptional({
    example:"Amazing movie"
   })
   @IsOptional()
   @IsString()
   comment?:string;
   
   
   }