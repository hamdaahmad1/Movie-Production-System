import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieQueryDto } from './dto/movie-query.dto';


@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMovieDto) {


    if (new Date(dto.releaseDate) > new Date()) {
      throw new BadRequestException(
        'Release date cannot be in the future',
      );
    }

    const existingMovie =
      await this.prisma.movie.findFirst({
        where: {
          title: {
            equals: dto.title,
            mode: 'insensitive',
          },
        },
      });

    if (existingMovie) {
      throw new BadRequestException(
        'A movie with this title already exists.',
      );
    }

    const director =
      await this.prisma.director.findUnique({
        where: {
          id: dto.directorId,
        },
      });

    if (!director) {
      throw new NotFoundException(
        'Director not found.',
      );
    }


    const actors =
      await this.prisma.actor.findMany({
        where: {
          id: {
            in: dto.actorIds,
          },
        },
      });

    if (
      actors.length !== dto.actorIds.length
    ) {
      throw new BadRequestException(
        'One or more actor IDs are invalid.',
      );
    }

    return this.prisma.movie.create({
      data: {
        title: dto.title,
        description: dto.description,
        releaseDate: new Date(dto.releaseDate),
        duration: dto.duration,
        genre: dto.genre,
        language: dto.language,
        rating: dto.rating,
        trailerId: dto.trailerId,
        posterPath: dto.posterPath,

        director: {
          connect: {
            id: dto.directorId,
          },
        },

        actors: {
          connect: dto.actorIds.map((id) => ({
            id,
          })),
        },
      },

      include: {
        director: true,
        actors: true,
      },
    });
  }


  async findAll(query: MovieQueryDto) {
    const {
      search,
      genre,
      directorId,
      actorId,
      year,
      sortBy,
      order,
      page = 1,
      limit = 10,
    } = query;
  
    const where: any = {};
  
    if (search) {
      where.title = {
        contains: search,
        mode: "insensitive",
      };
    }
  
    if (genre) {
      where.genre = {
        contains: genre,
        mode: "insensitive",
      };
    }
  
    if (directorId) {
      where.directorId = directorId;
    }
  
    if (actorId) {
      where.actors = {
        some: {
          id: actorId,
        },
      };
    }
  
    if (
      year &&
      !isNaN(year) &&
      String(year).length === 4
    ) {
      where.releaseDate = {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year + 1}-01-01`),
      };
    }
    
    let orderBy: any = {
      createdAt: "desc",
    };
  
    if (sortBy) {
      const sortOrder = order === "asc" ? "asc" : "desc";
  
      switch (sortBy) {
        case "title":
          orderBy = {
            title: sortOrder,
          };
          break;
  
        case "rating":
          orderBy = {
            rating: sortOrder,
          };
          break;
  
        case "year":
          orderBy = {
            releaseDate: sortOrder,
          };
          break;
  
        default:
          orderBy = {
            createdAt: "desc",
          };
      }
    }
  
    const skip = (page - 1) * limit;
  
    const [movies, total] = await Promise.all([
      this.prisma.movie.findMany({
        where,
  
        include: {
          director: true,
          actors: true,
        },
  
        orderBy,
  
        skip,
  
        take: limit,
      }),
  
      this.prisma.movie.count({
        where,
      }),
    ]);
  
    return {
      data: movies,
  
      total,
  
      page,
  
      limit,
  
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const movie =
      await this.prisma.movie.findUnique({
        where: {
          id,
        },

        include: {
          director: true,
          actors: true,
        },
      });

    if (!movie) {
      throw new NotFoundException(
        'Movie not found',
      );
    }

    return movie;
  }

 
  async update(
    id: number,
    dto: CreateMovieDto,
  ) {
  

    const movie =
      await this.prisma.movie.findUnique({
        where: {
          id,
        },
      });

    if (!movie) {
      throw new NotFoundException(
        'Movie not found',
      );
    }

    
    if (
      new Date(dto.releaseDate) > new Date()
    ) {
      throw new BadRequestException(
        'Release date cannot be in the future',
      );
    }

    
    const existingMovie =
      await this.prisma.movie.findFirst({
        where: {
          title: {
            equals: dto.title,
            mode: 'insensitive',
          },

          NOT: {
            id,
          },
        },
      });

    if (existingMovie) {
      throw new BadRequestException(
        'A movie with this title already exists.',
      );
    }

  

    const director =
      await this.prisma.director.findUnique({
        where: {
          id: dto.directorId,
        },
      });

    if (!director) {
      throw new NotFoundException(
        'Director not found.',
      );
    }

    

    const actors =
      await this.prisma.actor.findMany({
        where: {
          id: {
            in: dto.actorIds,
          },
        },
      });

    if (
      actors.length !== dto.actorIds.length
    ) {
      throw new BadRequestException(
        'One or more actor IDs are invalid.',
      );
    }



    return this.prisma.movie.update({
      where: {
        id,
      },

      data: {
        title: dto.title,
        description: dto.description,
        releaseDate: new Date(dto.releaseDate),
        duration: dto.duration,
        genre: dto.genre,
        language: dto.language,
        rating: dto.rating,
        trailerId: dto.trailerId,
        posterPath: dto.posterPath,

        director: {
          connect: {
            id: dto.directorId,
          },
        },

        actors: {
          set: dto.actorIds.map((id) => ({
            id,
          })),
        },
      },

      include: {
        director: true,
        actors: true,
      },
    });
  }



  async partialUpdate(
    id: number,
    dto: UpdateMovieDto,
  ) {
    
    const movie =
      await this.prisma.movie.findUnique({
        where: {
          id,
        },
      });

    if (!movie) {
      throw new NotFoundException(
        'Movie not found',
      );
    }

   
    if (
      dto.releaseDate &&
      new Date(dto.releaseDate) > new Date()
    ) {
      throw new BadRequestException(
        'Release date cannot be in the future',
      );
    }

   

    if (dto.title) {
      const existingMovie =
        await this.prisma.movie.findFirst({
          where: {
            title: {
              equals: dto.title,
              mode: 'insensitive',
            },

            NOT: {
              id,
            },
          },
        });

      if (existingMovie) {
        throw new BadRequestException(
          'A movie with this title already exists.',
        );
      }
    }

   

    if (dto.directorId) {
      const director =
        await this.prisma.director.findUnique({
          where: {
            id: dto.directorId,
          },
        });

      if (!director) {
        throw new NotFoundException(
          'Director not found.',
        );
      }
    }

    
    if (dto.actorIds) {
      const actors =
        await this.prisma.actor.findMany({
          where: {
            id: {
              in: dto.actorIds,
            },
          },
        });

      if (
        actors.length !== dto.actorIds.length
      ) {
        throw new BadRequestException(
          'One or more actor IDs are invalid.',
        );
      }
    }

   
    const {
      directorId,
      actorIds,
      releaseDate,
      ...movieData
    } = dto;

    

    return this.prisma.movie.update({
      where: {
        id,
      },

      data: {
        ...movieData,

        releaseDate: releaseDate
          ? new Date(releaseDate)
          : undefined,

        director: directorId
          ? {
              connect: {
                id: directorId,
              },
            }
          : undefined,

        actors: actorIds
          ? {
              set: actorIds.map((id) => ({
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

 
  async remove(id: number) {
    const movie =
      await this.prisma.movie.findUnique({
        where: {
          id,
        },
      });

    if (!movie) {
      throw new NotFoundException(
        'Movie not found',
      );
    }

    return this.prisma.movie.delete({
      where: {
        id,
      },
    });
  }

  async getGenres() {

    const movies = await this.prisma.movie.findMany({
      select:{
        genre:true,
      },
    });
  
  
    const genres = new Set<string>();
  
  
    movies.forEach((movie)=>{
  
      if(movie.genre){
  
        movie.genre
        .split(",")
        .forEach((genre)=>{
  
          genres.add(
            genre.trim()
          );
  
        });
  
      }
  
    });
  
  
    return Array.from(genres);
  
  }
}