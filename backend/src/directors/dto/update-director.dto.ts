import { CreateDirectorDto } from "./create-director.dto";
import { PartialType } from '@nestjs/swagger';


export class UpdateDirectorDto extends PartialType(CreateDirectorDto){
  imagePath: any;
};
