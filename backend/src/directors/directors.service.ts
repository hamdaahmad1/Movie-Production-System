import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
  ConflictException
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import{ DirectorQueryDto } from './dto/director-query.dto';
import{ CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class DirectorsService {
  private readonly logger = new Logger(DirectorsService.name);

  constructor(private prisma: PrismaService,private cloudinaryService: CloudinaryService) {}

  

  async create(dto: CreateDirectorDto,file?: Express.Multer.File) {
    // Future DOB validation
    if (new Date(dto.dob) > new Date()) 
      {
        this.logger.warn("DOB cannot be in future")
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

    if (existingDirector)
       {
        this.logger.warn("A director with this name already exists")
      throw new ConflictException(
        'A director with this name already exists.',
      );
    }

    let imagePath = null;

if(file){

 try {

    const uploadResult:any =
      await this.cloudinaryService.uploadImage(file);
    imagePath = uploadResult.secure_url;
    this.logger.log(
      "Director poster uploaded successfully"
    );

  }
  catch(error){
    this.logger.error(
      "Director poster upload failed",
      error.stack
    );
    throw error;

}
}

    const updatedDirector= await this.prisma.director.create({
      data: {
        name: dto.name,
        dob: new Date(dto.dob),
        nationality: dto.nationality,
        biography: dto.biography,

        // Save URL directly
        imagePath,
      },
    });
    this.logger.log("Director created successfully:", updatedDirector.name);
    return updatedDirector;
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
      this.logger.warn(`Director with ID ${id} not found.`);
      throw new NotFoundException(
        'Director not found',
      );
    }

    return director;
  }

  

  async update(
    id: number,
    dto: CreateDirectorDto,
    file?:Express.Multer.File,
  ) {
    const director =
      await this.prisma.director.findUnique({
        where: { id },
      });

    if (!director) {
      this.logger.warn(`Director with ID ${id} not found for update.`);

      throw new NotFoundException(
        'Director not found',
      );
    }

    // Future DOB validation
    if (
      dto.dob &&
      new Date(dto.dob) > new Date()
    ) {
      this.logger.warn("Date of birth cannot be in future")
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
      this.logger.warn("A director with this name already exists")
      throw new ConflictException(
        'A director with this name already exists.',
      );
    }

    let imagePath =
director.imagePath;


if(file){

 try {

    const uploadResult:any =
      await this.cloudinaryService.uploadImage(file);
    imagePath = uploadResult.secure_url;
    this.logger.log(
      "Director poster uploaded successfully"
    );

  }
  catch(error){
    this.logger.error(
      "Director poster upload failed",
      error.stack
    );
    throw error;

}

}

    const updatedDirector = await this.prisma.director.update({
      where: { id },

      data: {
        name: dto.name,
        dob: new Date(dto.dob),
        nationality: dto.nationality,
        biography: dto.biography,
        imagePath,
      },
    });

    this.logger.log(`Director with ID ${id} updated successfully.`);
    return updatedDirector;
  }

  
  async partialUpdate(
    id: number,
    dto: UpdateDirectorDto,
    file?:Express.Multer.File,
  ) {
    const director =
      await this.prisma.director.findUnique({
        where: { id },
      });

    if (!director) {
      this.logger.warn(`Director with ID ${id} not found for partial update.`);
      throw new NotFoundException(
        'Director not found',
      );
    }

    // Future DOB validation
    if (
      dto.dob &&
      new Date(dto.dob) > new Date()
    ) {
      this.logger.warn("Date of birth cannot be in future")
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

        this.logger.warn(`Duplicate director name detected during partial update for ID ${id}.`);
        throw new ConflictException(
          'A director with this name already exists.',
        );
      }
    }

    let imagePath =
director.imagePath;


if(file){

  try {

    const uploadResult:any =
      await this.cloudinaryService.uploadImage(file);
    imagePath = uploadResult.secure_url;
    this.logger.log(
      "Director poster uploaded successfully"
    );

  }
  catch(error){
    this.logger.error(
      "Director poster upload failed",
      error.stack
    );
    throw error;

}

}

    const updatedDirector = await this.prisma.director.update({
      where: { id },

      data: {
        name: dto.name,

        dob: dto.dob
          ? new Date(dto.dob)
          : undefined,

        nationality: dto.nationality,
        biography: dto.biography,

        // Update URL only if provided
        imagePath,
      },
    });
    this.logger.log(`Director with ID ${id} partially updated successfully.`);
    return updatedDirector;
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
      this.logger.warn(`Director with ID ${id} not found for deletion.`);
      throw new NotFoundException(
        'Director not found',
      );
    }

    if (director.movies.length > 0) {
      this.logger.warn(`Attempted to delete director with ID ${id} who is assigned to movies.`);
      throw new BadRequestException(
        'Cannot delete this director because they are assigned to one or more movies.',
      );
    }

    const deletedDirector= await this.prisma.director.delete({
      where: { id },
    });
    this.logger.log(`Director with ID ${id} deleted successfully.`);
    return deletedDirector;

  }
}