import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';


@Injectable()
export class MoviesService 
{

constructor(private prisma: PrismaService) {}



async create(dto:CreateMovieDto)
{

    const currentDate = new Date();

    if(new Date(dto.releaseDate) > currentDate)
    {
        throw new BadRequestException(
            'Release date cannot be in the future'
        );
    }


    return this.prisma.movie.create(
    {

        data:
        {
            title: dto.title,
            description: dto.description,
            releaseDate: new Date(dto.releaseDate),
            language: dto.language,
            posterUrl: dto.posterUrl,
            genre: dto.genre,
            rating: dto.rating,
            duration: dto.duration,
            trailerId: dto.trailerId,


            director:
            {
                connect:
                {
                    id:dto.directorId
                }
            },


            actors:
            {
                connect:
                dto.actorIds.map(id=>({
                    id
                }))
            }

        },


        include:
        {
            director:true,
            actors:true
        }

    });

}



async findAll()
{
    return this.prisma.movie.findMany({

        include:
        {
            director:true,
            actors:true,
        },

    });
}




async findOne(id:number)
{

    const movie = await this.prisma.movie.findUnique({

        where:
        {
            id
        },


        include:
        {
            director:true,
            actors:true,
        },

    });


    if(!movie)
    {
        throw new NotFoundException(
            'Movie Not Found'
        );
    }


    return movie;

}





async update(id:number, dto:CreateMovieDto)
{

    if(new Date(dto.releaseDate) > new Date())
    {
        throw new BadRequestException(
            'Release date cannot be in the future'
        );
    }



    return this.prisma.movie.update({

        where:
        {
            id
        },


        data:
        {

            title:dto.title,

            description:dto.description,

            releaseDate:new Date(dto.releaseDate),

            language:dto.language,

            posterUrl:dto.posterUrl,

            genre:dto.genre,

            rating:dto.rating,

            duration:dto.duration,

            trailerId: dto.trailerId,



            director:
            {
                connect:
                {
                    id:dto.directorId
                }
            },



            actors:
            {
                set:
                dto.actorIds.map(id=>({
                    id
                }))
            }


        },


        include:
        {
            director:true,
            actors:true
        }


    });

}







async partialUpdate(id:number, dto:UpdateMovieDto)
{

    if(dto.releaseDate && new Date(dto.releaseDate) > new Date())
    {
        throw new BadRequestException(
            'Release date cannot be in the future'
        );
    }



    const {
        directorId,
        actorIds,
        releaseDate,
        ...movieData
    } = dto;



    return this.prisma.movie.update({

        where:
        {
            id
        },


        data:
        {


            ...movieData,


            releaseDate:
            releaseDate 
            ? new Date(releaseDate)
            : undefined,



            director:
            directorId
            ?
            {
                connect:
                {
                    id:directorId
                }
            }
            :
            undefined,



            actors:
            actorIds
            ?
            {
                set:
                actorIds.map(id=>({
                    id
                }))
            }
            :
            undefined


        },


        include:
        {
            director:true,
            actors:true
        }


    });

}







async remove(id:number)
{

    const movie = await this.prisma.movie.findUnique({

        where:
        {
            id
        }

    });



    if(!movie)
    {
        throw new NotFoundException(
            "Movie Not Found"
        );
    }



    return this.prisma.movie.delete({

        where:
        {
            id
        }

    });

}


}