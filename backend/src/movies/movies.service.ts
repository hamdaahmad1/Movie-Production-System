import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  // =========================
  // CREATE MOVIE
  // =========================

  async create(dto: CreateMovieDto) {
    // =========================
    // RELEASE DATE VALIDATION
    // =========================

    if (new Date(dto.releaseDate) > new Date()) {
      throw new BadRequestException(
        'Release date cannot be in the future',
      );
    }

    // =========================
    // DUPLICATE MOVIE VALIDATION
    // =========================

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

    // =========================
    // DIRECTOR VALIDATION
    // =========================

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

    // =========================
    // ACTORS VALIDATION
    // =========================

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

    // =========================
    // CREATE MOVIE
    // =========================

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

  // =========================
  // GET ALL MOVIES
  // =========================

  async findAll() {
    return this.prisma.movie.findMany({
      include: {
        director: true,
        actors: true,
      },
    });
  }

  // =========================
  // GET ONE MOVIE
  // =========================

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

  // =========================
  // PUT - FULL UPDATE
  // =========================

  async update(
    id: number,
    dto: CreateMovieDto,
  ) {
    // =========================
    // CHECK MOVIE EXISTS
    // =========================

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

    // =========================
    // RELEASE DATE VALIDATION
    // =========================

    if (
      new Date(dto.releaseDate) > new Date()
    ) {
      throw new BadRequestException(
        'Release date cannot be in the future',
      );
    }

    // =========================
    // DUPLICATE TITLE VALIDATION
    // =========================

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

    // =========================
    // DIRECTOR VALIDATION
    // =========================

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

    // =========================
    // ACTORS VALIDATION
    // =========================

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

    // =========================
    // FULL UPDATE
    // =========================

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

  // =========================
  // PATCH - PARTIAL UPDATE
  // =========================

  async partialUpdate(
    id: number,
    dto: UpdateMovieDto,
  ) {
    // =========================
    // CHECK MOVIE EXISTS
    // =========================

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

    // =========================
    // RELEASE DATE VALIDATION
    // =========================

    if (
      dto.releaseDate &&
      new Date(dto.releaseDate) > new Date()
    ) {
      throw new BadRequestException(
        'Release date cannot be in the future',
      );
    }

    // =========================
    // DUPLICATE TITLE VALIDATION
    // =========================

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

    // =========================
    // DIRECTOR VALIDATION
    // =========================

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

    // =========================
    // ACTORS VALIDATION
    // =========================

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

    // =========================
    // SEPARATE RELATION FIELDS
    // =========================

    const {
      directorId,
      actorIds,
      releaseDate,
      ...movieData
    } = dto;

    // =========================
    // PARTIAL UPDATE
    // =========================

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

  // =========================
  // DELETE MOVIE
  // =========================

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
}