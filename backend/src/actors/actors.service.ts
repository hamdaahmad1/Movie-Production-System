import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { ActorQueryDto } from './dto/actor-query.dto';

@Injectable()
export class ActorsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  
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

 
  async findAll(query: ActorQueryDto) {
    const {
      search,
      birthYear,
      sortBy,
      order,
      page = 1,
      limit = 10,
    } = query;
  
    const where: any = {};
  
    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }
  
  
    if (
      birthYear &&
      !isNaN(Number(birthYear)) &&
      String(birthYear).length === 4
    ) {
    
      const year = Number(birthYear);
    
      where.dob = {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year + 1}-01-01`)
      };
    }
  
  
    let orderBy: any = {
      createdAt: "desc",
    };
  
  
    if (sortBy) {
  
      const sortOrder = order === "asc" ? "asc" : "desc";
  
  
      switch (sortBy) {
  
        case "name":
          orderBy = {
            name: sortOrder,
          };
          break;
  
  
        case "dob":
          orderBy = {
            dob: sortOrder,
          };
          break;
  
  
        case "createdAt":
          orderBy = {
            createdAt: sortOrder,
          };
          break;
  
  
        default:
          orderBy = {
            createdAt: "desc",
          };
      }
    }
  
  
    const skip = (page - 1) * limit;
  
  
    const [actors, total] = await Promise.all([
  
      this.prisma.actor.findMany({
  
        where,
  
        include: {
          movies: true,
        },
  
        orderBy,
  
        skip,
  
        take: limit,
      }),
  
  
      this.prisma.actor.count({
        where,
      }),
  
    ]);
  
  
    return {
      data: actors,
  
      total,
  
      page,
  
      limit,
  
      totalPages: Math.ceil(total / limit),
    };
  }
  
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