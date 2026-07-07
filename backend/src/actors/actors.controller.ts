import { UpdateActorDto } from './dto/update-actor.dto';
import { CreateActorDto } from './dto/create-actor.dto';
import { ActorsService } from './actors.service';
import { ParseIntPipe } from '@nestjs/common';

import { 
    Controller,
    Post,
    Patch,
    Get,
    Delete,
    Body, 
    Param

 } from '@nestjs/common';

@Controller('actors')
export class ActorsController 
{
    constructor(private actorService:ActorsService ){}

    @Post()
    create (@Body() dto: CreateActorDto){
        return this.actorService.create(dto);
    }


    @Get()
    findAll(){
        return this.actorService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id:number){
        return this.actorService.findOne(id);
    }

    @Patch(':id')
    update (

        @Param('id',ParseIntPipe) id:number,
        @Body() dto:UpdateActorDto

    ){
        return this.actorService.update(id,dto);
    }

    @Delete(':id')
    remove(@Param('id',ParseIntPipe)id:number){
        return  this.actorService.remove(id);
    }

}

