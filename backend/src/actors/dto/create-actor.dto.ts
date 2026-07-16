import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsDateString,
  Min,
  Max,
  MinLength,
  MaxLength,
  Matches,
  IsUrl,
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

import {
  Transform,
  Type,
} from "class-transformer";

export class CreateActorDto {
  @ApiProperty({
    example: "Leonardo",
    description: "Actor name",
  })
  @Transform(({ value }) =>
    value?.trim().replace(/\s+/g, " "),
  )
  @IsString()
  @IsNotEmpty({
    message: "Name is required",
  })
  @MinLength(2, {
    message:
      "Name must be at least 2 characters long",
  })
  @MaxLength(100, {
    message:
      "Name cannot exceed 100 characters",
  })
  @Matches(/^[A-Za-z\s.'-]+$/, {
    message:
      "Name can only contain letters, spaces, apostrophes ('), hyphens (-), and periods (.)",
  })
  @Matches(/^(?!([A-Za-z])\1+$).*/, {
    message:
      "Name cannot consist of the same repeated character",
  })
  name: string;

  @ApiProperty({
    example: "1974-11-11",
    description: "Actor date of birth",
  })
  @IsDateString(
    {},
    {
      message:
        "Date of birth must be a valid date",
    },
  )
  dob: string;

  @ApiProperty({
    example: "Canadian",
    description: "Actor nationality",
  })
  @Transform(({ value }) =>
    value?.trim(),
  )
  @IsString()
  @IsNotEmpty({
    message: "Nationality is required",
  })
  @MinLength(2, {
    message:
      "Nationality must be at least 2 characters long",
  })
  @MaxLength(50, {
    message:
      "Nationality cannot exceed 50 characters",
  })
  @Matches(/^[A-Za-z\s]+$/, {
    message:
      "Nationality can only contain letters and spaces",
  })
  nationality: string;

  @ApiProperty({
    example: "Male",
    description: "Actor gender",
  })
  @Transform(({ value }) =>
    value?.trim(),
  )
  @IsString()
  @IsNotEmpty({
    message: "Gender is required",
  })
  @Matches(
    /^(Male|Female|Other)$/i,
    {
      message:
        "Gender must be Male, Female, or Other",
    },
  )
  gender: string;

  @ApiProperty({
    example:
      "Leonardo Wilhelm DiCaprio is an American actor, producer, and environmentalist. He has often played unconventional parts, particularly in biopics and period films. He is the recipient of numerous accolades, including an Academy Award and three Golden Globe Awards.",
    description: "Actor biography",
  })
  @Transform(({ value }) =>
    value?.trim(),
  )
  @IsString()
  @IsNotEmpty({
    message: "Biography is required",
  })
  @MinLength(20, {
    message:
      "Biography must be at least 20 characters long",
  })
  @MaxLength(1000, {
    message:
      "Biography cannot exceed 1000 characters",
  })
  biography: string;

  @ApiProperty({
    example: "5",
    description:
      "Number of awards won by the actor",
  })
  @Type(() => Number)
  @IsInt({
    message:
      "Awards must be an integer",
  })
  @Min(0, {
    message:
      "Awards cannot be negative",
  })
  @Max(1000, {
    message:
      "Awards cannot exceed 1000",
  })
  awards: number;

  @ApiProperty({
    example:
      "https://example.com/images/leonardo-dicaprio.jpg",
    description:
      "URL of the actor's image",
  })
  @Transform(({ value }) =>
    value?.trim(),
  )
  @IsString()
  @IsNotEmpty({
    message:
      "Image URL is required",
  })
  @IsUrl(
    {},
    {
      message:
        "Image URL must be a valid URL",
    },
  )
  imagePath: string;
}