import {

    IsInt,
    IsString,
    IsNotEmpty,
    IsDateString,


} from 'class-validator'

export class CreateActorDto{

    @IsString()
    @IsNotEmpty({message: 'Name is required'})
    name : string

    @IsDateString()
    dob: string;

    @IsString()
    @IsNotEmpty({message: 'Nationality is required'})
    nationality : string
}

