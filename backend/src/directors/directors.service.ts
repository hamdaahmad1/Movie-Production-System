import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import{ DirectorQueryDto } from './dto/director-query.dto';

@Injectable()
export class DirectorsService {
  constructor(private prisma: PrismaService) {}

  

  async create(dto: CreateDirectorDto) {
    // Future DOB validation
    if (new Date(dto.dob) > new Date()) {
      throw new BadRequestException(
        'Date of birth cannot be in the future',
      );
    }

    // Duplicate director validation
    const existingDirector =
      await this.prisma.director.findFirst({
        where: {
          name: {
            equals: dto.name,
            mode: 'insensitive',
          },
        },
      });

    if (existingDirector) {
      throw new BadRequestException(
        'A director with this name already exists.',
      );
    }

    return this.prisma.director.create({
      data: {
        name: dto.name,
        dob: new Date(dto.dob),
        nationality: dto.nationality,
        biography: dto.biography,

        // Save URL directly
        imagePath: dto.imagePath,
      },
    });
  }

  

  async findAll(query: DirectorQueryDto) {

    const {
      search,
      birthYear,
      sortBy,
      order,
      page = 1,
      limit = 10,
    } = query;
  
  
    const where: any = {};
  
  
    // Search by name
    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }
  
  
    // Filter by birth year
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
  

    // Default sorting
    let orderBy: any = {
      createdAt: "desc",
    };
  
  
  
    if (sortBy) {
  
      const sortOrder =order === "asc"? "asc": "desc";
      switch(sortBy) {
  
  
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
            createdAt:"desc",
          };
  
      }
  
    }
  
  
  
    const skip =
      (page - 1) * limit;
  
  
  
    const [
      directors,
      total
    ] = await Promise.all([
  
  
      this.prisma.director.findMany({
  
        where,
  
  
        include:{
          movies:true,
        },
  
  
        orderBy,
  
  
        skip,
  
  
        take:limit,
  
      }),
  
  
  
      this.prisma.director.count({
  
        where,
  
      }),
  
  
    ]);
  
  
  
  
    return {
  
      data:directors,
  
      total,
  
      page,
  
      limit,
  
      totalPages:
        Math.ceil(total / limit),
  
    };
  
  }

  

  async findOne(id: number) {
    const director =
      await this.prisma.director.findUnique({
        where: { id },
        include: {
          movies: true,
        },
      });

    if (!director) {
      throw new NotFoundException(
        'Director not found',
      );
    }

    return director;
  }

  

  async update(
    id: number,
    dto: CreateDirectorDto,
  ) {
    const director =
      await this.prisma.director.findUnique({
        where: { id },
      });

    if (!director) {
      throw new NotFoundException(
        'Director not found',
      );
    }

    // Future DOB validation
    if (
      dto.dob &&
      new Date(dto.dob) > new Date()
    ) {
      throw new BadRequestException(
        'Date of birth cannot be in the future',
      );
    }

    // Duplicate name validation
    const existingDirector =
      await this.prisma.director.findFirst({
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

    if (existingDirector) {
      throw new BadRequestException(
        'A director with this name already exists.',
      );
    }

    return this.prisma.director.update({
      where: { id },

      data: {
        name: dto.name,
        dob: new Date(dto.dob),
        nationality: dto.nationality,
        biography: dto.biography,

        // Replace URL
        imagePath: dto.imagePath,
      },
    });
  }

  
  async partialUpdate(
    id: number,
    dto: UpdateDirectorDto,
  ) {
    const director =
      await this.prisma.director.findUnique({
        where: { id },
      });

    if (!director) {
      throw new NotFoundException(
        'Director not found',
      );
    }

    // Future DOB validation
    if (
      dto.dob &&
      new Date(dto.dob) > new Date()
    ) {
      throw new BadRequestException(
        'Date of birth cannot be in the future',
      );
    }

    // Duplicate name validation
    if (dto.name) {
      const existingDirector =
        await this.prisma.director.findFirst({
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

      if (existingDirector) {
        throw new BadRequestException(
          'A director with this name already exists.',
        );
      }
    }

    return this.prisma.director.update({
      where: { id },

      data: {
        name: dto.name,

        dob: dto.dob
          ? new Date(dto.dob)
          : undefined,

        nationality: dto.nationality,
        biography: dto.biography,

        // Update URL only if provided
        imagePath: dto.imagePath,
      },
    });
  }

 

  async remove(id: number) {
    const director =
      await this.prisma.director.findUnique({
        where: { id },

        include: {
          movies: true,
        },
      });

    if (!director) {
      throw new NotFoundException(
        'Director not found',
      );
    }

    if (director.movies.length > 0) {
      throw new BadRequestException(
        'Cannot delete this director because they are assigned to one or more movies.',
      );
    }

    return this.prisma.director.delete({
      where: { id },
    });
  }
}