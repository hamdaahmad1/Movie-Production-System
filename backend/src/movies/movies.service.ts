import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ASYNC_OPTIONS_METADATA_KEYS } from '@nestjs/common/module-utils/constants';





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


    async update(id:number, dto:CreateMovieDto){
        const currentYear= new Date().getFullYear();

        if(dto.release_year && dto.release_year>currentYear){
            throw new BadRequestException(
                'Release Year cannot be in future'            );
        }
        const{directorId, actorIds, ...movieData}= dto;

        return this.prisma.movie.update({
            where: {
                id
            },
            data: {
                title: dto.title,
                genre: dto.genre,
                rating: dto.rating,
                duration: dto.duration,
                release_year: dto.release_year,
    
                director: {
                    connect: {
                        id: dto.directorId,
                    },
                },
    
                actors: {
                    set: dto.actorIds.map(id => ({
                        id,
                    })),
                },
            },
    


        });


    }
    async partialUpdate(id: number, dto: UpdateMovieDto) {
        const currentYear = new Date().getFullYear();
    
        if (dto.release_year && dto.release_year > currentYear) {
            throw new BadRequestException(
                'Release Year cannot be in the future',
            );
        }
    
        const { directorId, actorIds, ...movieData } = dto;
    
        return this.prisma.movie.update({
            where: {
                id,
            },
            data: {
                ...movieData,
    
                director: directorId
                    ? {
                          connect: {
                              id: directorId,
                          },
                      }
                    : undefined,
    
                actors: actorIds
                    ? {
                          set: actorIds.map(id => ({
                              id,
                          })),
                      }
                    : undefined,
            },
    
            include: {
                director: true,
                actors: true,
            },
        });
    }

    async remove(id:number){

        const movie =await this.prisma.movie.findUnique({

            where:{
                id
            },

        });
        if(!movie){
            throw new NotFoundException("Movie Not Found");

        }
        return this.prisma.movie.delete({

            where:{
                id
            },

        });

    }
}
