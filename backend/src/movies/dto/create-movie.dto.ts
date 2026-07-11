import{
    IsString,
    IsNotEmpty,
    IsInt,
    Min,
    Max,
    IsArray,
    ArrayNotEmpty,
    ArrayUnique,
    IsNumber,
    IsUrl,
    IsDateString,
    IsOptional,







}from 'class-validator'

export class CreateMovieDto{
    @IsString()
    @IsNotEmpty({message: 'Title is required'})
    title:string

    @IsString()
    @IsNotEmpty({ message: 'Description is required' })
    description: string;

    @IsDateString({}, { message: 'Release date must be a valid date' })
    releaseDate: string;

    @IsInt()
    @Min(1, {message : 'Rating must be atleast 1'}) 
    @Max(10,{message : 'Rating must not exceed 10'})
    rating:number;

    @IsInt()
    @Min(1,{message: 'Duration must be positive'})
    duration:number;

    @IsString()
    @IsNotEmpty({message:'Genre is Required'})
    genre: string;
    
    @IsString()
    @IsNotEmpty({ message: 'Language is required' })
    language: string;

    @IsString()
    @IsNotEmpty({message:'Poster URL is required'})
    @IsUrl({}, { message: 'Poster URL must be valid' })
    posterUrl: string;

    @IsString()
    @IsNotEmpty({message:'Trailer Id is required'})
    @IsUrl({}, {message:'Trailer Id must be valid'})
    trailerId:string

    @IsInt()
    directorId:number;

    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    actorIds: number[];



}