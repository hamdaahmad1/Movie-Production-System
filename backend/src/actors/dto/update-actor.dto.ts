import { CreateActorDto } from "./create-actor.dto";
import { PartialType } from "@nestjs/mapped-types";


export class UpdateActorDto extends PartialType(CreateActorDto){}