import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';





@Injectable()
export class MoviesService 
{
 constructor(private prisma: PrismaService) {}

 async create(dto:CreateMovieDto)
 {
    const currentYear= new Date().getFullYear();
    if(dto.release_year>currentYear)
    {
        throw new BadRequestException(
            'Year cannot be in the future'
        );
    }

    return this.prisma.movie.create(
        {
          data: 
          {
                title: dto.title,
                genre: dto.genre,
                rating: dto.rating,
                duration: dto.duration,
                release_year:dto.release_year,
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
                        id,

                    })),
                    
                },
        
            },

            include:{
                director:true,
                actors:true

            }

        } );

    }

    async findAll()
    {
        return this.prisma.movie.findMany({
        
            include: {
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
            include : 
            {
                director:true,
                actors:true,
            },

        });
        if(!movie)
        {
            throw new NotFoundException('Movie Not Found');

        }
        return movie;

    }
}
