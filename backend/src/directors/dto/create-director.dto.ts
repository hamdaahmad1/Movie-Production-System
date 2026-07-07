import 
{
    IsInt,
    IsString,
    IsNotEmpty,
    IsArray,
    ArrayNotEmpty,
    ArrayUnique,
    IsDateString,





} from 'class-validator'

export class CreateDirectorDto{

    @IsString()
    @IsNotEmpty({message: 'name is required'})
    name : string


    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    movies : number

    @IsDateString()
     dob : string




    


}