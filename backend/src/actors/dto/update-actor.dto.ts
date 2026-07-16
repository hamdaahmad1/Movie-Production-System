import { CreateActorDto } from "./create-actor.dto";
import { PartialType } from '@nestjs/swagger';

export class UpdateActorDto extends PartialType(CreateActorDto){}