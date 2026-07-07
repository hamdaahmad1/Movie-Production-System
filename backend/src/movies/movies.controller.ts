import { CreateMovieDto } from './dto/create-movie.dto';
import { MoviesService } from './movies.service';
import { ParseIntPipe } from '@nestjs/common';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { 
    Controller,
    Get,
    Post,
    Patch,
    Put,
    Delete,
    Body,
    Param,

 } from '@nestjs/common';

@Controller('movies')
export class MoviesController {
    constructor(private moviesService:MoviesService){}

    @Post()
    create(@Body() dto: CreateMovieDto){
        return this.moviesService.create(dto);
    }

    @Get()
    findAll(){
        return this.moviesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id:number){
        return this.moviesService.findOne(id);
    }

    @Patch(':id')
    update(

        @Param('id',ParseIntPipe) id :number,
        @Body() dto: UpdateMovieDto,

    ) {
        return this.moviesService.update(id,dto);

    }

    @Delete(':id')
    remove(@Param('id',ParseIntPipe) id:number){
        return this.moviesService.remove(id);
    }


}
