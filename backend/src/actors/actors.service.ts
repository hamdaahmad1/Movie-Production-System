import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
  ForbiddenException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { ActorQueryDto } from './dto/actor-query.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ActorsService {
  private readonly logger = new Logger(ActorsService.name);

  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  
  async create(dto: CreateActorDto, user:any, file: Express.Multer.File | undefined,
  ) {
    // Future DOB validation
    if (
      new Date(dto.dob) >
      new Date()
    ) {
      this.logger.error("Date of birth cannot be in future")
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
      this.logger.error("An actor with this name already exist")
      throw new BadRequestException(
        'An actor with this name already exists.',
      );
    }

    let imagePath = null;

if (file) {
  try {

    const uploadResult:any =
      await this.cloudinaryService.uploadImage(file);
    imagePath = uploadResult.secure_url;
    this.logger.log(
      "Actor poster uploaded successfully"
    );

  }
  catch(error){
    this.logger.error(
      "Actor poster upload failed",
      error.stack
    );
    throw error;
  
  }

}

    const actor= await this.prisma.actor.create({
      data: {
        name: dto.name,

        dob: new Date(dto.dob),

        nationality:
          dto.nationality,

        gender: dto.gender,

        biography:
          dto.biography,

        awards: dto.awards,

        imagePath,
        createdBy: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    this.logger.log("Actor created successfully: " + actor.id);

    return actor;
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

      this.logger.warn(
        `Actor not found. ID: ${id}`
      );

      throw new NotFoundException(
        'Actor not found',
      );
      
    }


    return actor;
  }

  
  async update(id: number, file: Express.Multer.File | undefined, dto: CreateActorDto) {
    const actor =
      await this.prisma.actor.findUnique({
        where: {
          id,
        },
      });

    if (!actor) {
      this.logger.warn("Actor not found")
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
      this.logger.error("Date of birth cannot be in future")
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
        this.logger.warn("an actor with this name already exists")
        throw new BadRequestException(
          'An actor with this name already exists.',
        );
      }
    }
    let imagePath = actor.imagePath;

if (file) {
  try {

    const uploadResult:any =
      await this.cloudinaryService.uploadImage(file);
    imagePath = uploadResult.secure_url;
    this.logger.log(
      "Actor poster uploaded successfully"
    );

  }
  catch(error){
    this.logger.error(
      "Actor poster upload failed",
      error.stack
    );
    throw error;
  
  }
}

    const updatedActor= await this.prisma.actor.update({
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

        imagePath,
      },
    });

    this.logger.log("Actor updated successfully: " + updatedActor.id);
    return updatedActor;
  }

  

  async partialUpdate(id: number, dto: UpdateActorDto, file?: Express.Multer.File | undefined) {
    const actor =
      await this.prisma.actor.findUnique({
        where: {
          id,
        },
      });

    if (!actor) {
      this.logger.error("Actor not found")
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
      this.logger.warn("dob cannot be in future")
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

      if (existingActor)
         {
          this.logger.error("an actor with this name already exists")
        throw new BadRequestException(
          'An actor with this name already exists.',
        );
      }
    }

    let imagePath = actor.imagePath;

if (file) {
  try {

    const uploadResult:any =
      await this.cloudinaryService.uploadImage(file);
    imagePath = uploadResult.secure_url;
    this.logger.log(
      "Actor poster uploaded successfully"
    );

  }
  catch(error){
    this.logger.error(
      "actor poster upload failed",
      error.stack
    );
    throw error;
  
  }
}

    const updatedActor= await this.prisma.actor.update({
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

        imagePath,
      },
    });

    this.logger.log("Actor partially updated successfully: " + updatedActor.id);
    return updatedActor;

  }

  

  async remove(id: number, user:any) {
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
      this.logger.warn("Actor not found. ID: " + id);
      throw new NotFoundException(
        'Actor not found',
      );
    }
    if (
      user.role === 'EDITOR' &&
      actor.createdById !== user.id
    ) {
      throw new ForbiddenException(
        'You can only delete actors that you created.',
      );
    }

    if (
      actor.movies.length > 0
    ) {
      this.logger.warn("Cannot delete this actor because they are assigned to one or more movies.")
      throw new BadRequestException(
        'Cannot delete this actor because they are assigned to one or more movies.',
      );
    }

    const deletedActors= await this.prisma.actor.delete({
      where: {
        id,
      },
    });
    
    this.logger.log("Actor deleted successfully: " + id);
    return deletedActors;
  }
}