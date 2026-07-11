import 
{
    IsString,
    IsNotEmpty,
    IsArray,
    ArrayNotEmpty,
    ArrayUnique,
    IsDateString,
    IsUrl,





} from 'class-validator'

export class CreateDirectorDto{

    @IsString()
    @IsNotEmpty({message: 'name is required'})
    name : string
    
    @IsString()
    @IsNotEmpty({ message: 'Nationality is required' })
    nationality: string

    @IsString()
    @IsNotEmpty({ message: 'Biography is required' })
    biography: string

    @IsNotEmpty({ message: 'Image URL is required'})
    @IsUrl({}, { message: 'Image URL must be valid' })
    imageUrl: string

    @IsArray()
    @ArrayNotEmpty({message:'Movies cannot be empty'})
    @ArrayUnique({message:'Movies must be unique'})
    movies : number[]

    @IsDateString({}, {message:'DOB must be a valid date'})
     dob : string




    


}