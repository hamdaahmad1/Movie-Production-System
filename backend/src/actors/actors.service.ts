import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';

@Injectable()
export class ActorsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  // =========================
  // CREATE ACTOR
  // =========================

  async create(
    dto: CreateActorDto,
  ) {
    // Future DOB validation
    if (
      new Date(dto.dob) >
      new Date()
    ) {
      throw new BadRequestException(
        'Date of birth cannot be in the future',
      );
    }

    // Duplicate actor validation
    const existingActor =
      await this.prisma.actor.findFirst({
        where: {
          name: {
            equals: dto.name,
            mode: 'insensitive',
          },
        },
      });

    if (existingActor) {
      throw new BadRequestException(
        'An actor with this name already exists.',
      );
    }

    return this.prisma.actor.create({
      data: {
        name: dto.name,

        dob: new Date(dto.dob),

        nationality:
          dto.nationality,

        gender: dto.gender,

        biography:
          dto.biography,

        awards: dto.awards,

        imagePath:
          dto.imagePath,
      },
    });
  }

  // =========================
  // GET ALL ACTORS
  // =========================

  async findAll() {
    return this.prisma.actor.findMany({
      include: {
        movies: true,
      },
    });
  }

  // =========================
  // GET ONE ACTOR
  // =========================

  async findOne(id: number) {
    const actor =
      await this.prisma.actor.findUnique({
        where: {
          id,
        },

        include: {
          movies: true,
        },
      });

    if (!actor) {
      throw new NotFoundException(
        'Actor not found',
      );
    }

    return actor;
  }

  // =========================
  // PUT - FULL UPDATE
  // =========================

  async update(
    id: number,
    dto: CreateActorDto,
  ) {
    const actor =
      await this.prisma.actor.findUnique({
        where: {
          id,
        },
      });

    if (!actor) {
      throw new NotFoundException(
        'Actor not found',
      );
    }

    // Future DOB validation
    if (
      dto.dob &&
      new Date(dto.dob) >
        new Date()
    ) {
      throw new BadRequestException(
        'Date of birth cannot be in the future',
      );
    }

    // Duplicate actor validation
    if (dto.name) {
      const existingActor =
        await this.prisma.actor.findFirst({
          where: {
            name: {
              equals: dto.name,
              mode: 'insensitive',
            },

            NOT: {
              id,
            },
          },
        });

      if (existingActor) {
        throw new BadRequestException(
          'An actor with this name already exists.',
        );
      }
    }

    return this.prisma.actor.update({
      where: {
        id,
      },

      data: {
        name: dto.name,

        dob: dto.dob
          ? new Date(dto.dob)
          : undefined,

        nationality:
          dto.nationality,

        gender: dto.gender,

        biography:
          dto.biography,

        awards: dto.awards,

        imagePath:
          dto.imagePath,
      },
    });
  }

  // =========================
  // PATCH - PARTIAL UPDATE
  // =========================

  async partialUpdate(
    id: number,
    dto: UpdateActorDto,
  ) {
    const actor =
      await this.prisma.actor.findUnique({
        where: {
          id,
        },
      });

    if (!actor) {
      throw new NotFoundException(
        'Actor not found',
      );
    }

    // Future DOB validation
    if (
      dto.dob &&
      new Date(dto.dob) >
        new Date()
    ) {
      throw new BadRequestException(
        'Date of birth cannot be in the future',
      );
    }

    // Duplicate actor validation
    if (dto.name) {
      const existingActor =
        await this.prisma.actor.findFirst({
          where: {
            name: {
              equals: dto.name,
              mode: 'insensitive',
            },

            NOT: {
              id,
            },
          },
        });

      if (existingActor) {
        throw new BadRequestException(
          'An actor with this name already exists.',
        );
      }
    }

    return this.prisma.actor.update({
      where: {
        id,
      },

      data: {
        name: dto.name,

        dob: dto.dob
          ? new Date(dto.dob)
          : undefined,

        nationality:
          dto.nationality,

        gender: dto.gender,

        biography:
          dto.biography,

        awards: dto.awards,

        imagePath:
          dto.imagePath,
      },
    });
  }

  // =========================
  // DELETE ACTOR
  // =========================

  async remove(id: number) {
    const actor =
      await this.prisma.actor.findUnique({
        where: {
          id,
        },

        include: {
          movies: true,
        },
      });

    if (!actor) {
      throw new NotFoundException(
        'Actor not found',
      );
    }

    if (
      actor.movies.length > 0
    ) {
      throw new BadRequestException(
        'Cannot delete this actor because they are assigned to one or more movies.',
      );
    }

    return this.prisma.actor.delete({
      where: {
        id,
      },
    });
  }
}