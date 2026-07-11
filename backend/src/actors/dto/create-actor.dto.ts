import {

    IsInt,
    IsString,
    IsNotEmpty,
    IsDateString,
    Min,
    IsUrl,


} from 'class-validator'

export class CreateActorDto{

    @IsString()
    @IsNotEmpty({message: 'Name is required'})
    name : string

    @IsDateString()
    dob: string

    @IsString()
    @IsNotEmpty({message: 'Nationality is required'})
    nationality : string

    @IsString()
    @IsNotEmpty({ message: 'Gender is required' })
    gender: string

    @IsString()
    @IsNotEmpty({ message: 'Biography is required' })
    biography: string

    @IsInt()
    @Min(0, { message: 'Awards cannot be negative' })
    awards: number

    @IsUrl({}, { message: 'Image URL must be valid' })
    imageUrl: string
}

