import{
    IsString,
    IsNotEmpty,
    IsInt,
    Min,
    Max,
    IsArray,
    ArrayNotEmpty,
    ArrayUnique,







}from 'class-validator'

export class CreateMovieDto{
    @IsString()
    @IsNotEmpty({message: 'Title is required'})
    title:string

    @IsInt()
    release_year:number;

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

    @IsInt()
    directorId:number;

    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    actorIds: number[];



}