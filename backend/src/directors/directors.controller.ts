import { UpdateDirectorDto } from './dto/update-director.dto';
import { CreateDirectorDto } from './dto/create-director.dto';
import { DirectorsService } from './directors.service';

import { ParseIntPipe } from '@nestjs/common';


import { 
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,

 } from '@nestjs/common';

@Controller('directors')
export class DirectorsController {

    constructor(private directorService:DirectorsService ){}

    @Post()
    create (@Body() dto: CreateDirectorDto){
        return this.directorService.create(dto);
    }


    @Get()
    findAll(){
        return this.directorService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id:number){
        return this.directorService.findOne(id);
    }

    @Patch(':id')
    update (

        @Param('id',ParseIntPipe) id:number,
        @Body() dto:UpdateDirectorDto

    ){
        return this.directorService.update(id,dto);
    }

    @Delete(':id')
    remove(@Param('id',ParseIntPipe)id:number){
       return this.directorService.remove(id);
    }



}
