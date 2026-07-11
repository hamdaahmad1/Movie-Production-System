import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DirectorsService {

    constructor(private prisma: PrismaService) {}


    async create(dto:CreateDirectorDto)
    {
        const DateOfBirth = new Date();

        if(new Date(dto.dob) > DateOfBirth)
        {
            throw new BadRequestException(
                'Date of birth cannot be in the future'
            );
        }


        return this.prisma.director.create({
            data:
            {
                name: dto.name,
                dob: new Date(dto.dob),
                nationality: dto.nationality,
                biography: dto.biography,
                imageUrl: dto.imageUrl
            }

        });

    }


    async findAll(){

        return this.prisma.director.findMany({
            include:{
                movies:true
            },
        });

    }


    async findOne(id:number)
    {
        const director = await this.prisma.director.findUnique({

            where:{
                id
            },

            include:{
                movies:true,
            }

        });


        if(!director)
        {
            throw new BadRequestException(
                'Director Not Found'
            )
        }


        return director;
    }



    async update(id:number, dto:CreateDirectorDto)
    {

        if(dto.dob){

            const DOB = new Date();


            if(new Date(dto.dob) > DOB)
            {
                throw new BadRequestException(
                    'Date of birth cannot be in the future'
                );
            }

        }


        return this.prisma.director.update({

            where:{
                id
            },


            data:
            {
                name:dto.name,
                dob:dto.dob ? new Date(dto.dob) : undefined,
                nationality:dto.nationality,
                biography:dto.biography,
                imageUrl:dto.imageUrl
            },

        });

    }




    async partialUpdate(id:number, dto:UpdateDirectorDto)
    {

        if(dto.dob){

            const DOB = new Date();


            if(new Date(dto.dob) > DOB)
            {
                throw new BadRequestException(
                    'Date of birth cannot be in the future'
                );
            }

        }


        return this.prisma.director.update({

            where:{
                id
            },


            data:
            {
                name:dto.name,
                dob:dto.dob ? new Date(dto.dob) : undefined,
                nationality:dto.nationality,
                biography:dto.biography,
                imageUrl:dto.imageUrl
            },

        });

    }




    async remove(id:number)
    {
        const director = await this.prisma.director.findUnique({

            where:{
                id
            },

        });


        if(!director)
        {
            throw new BadRequestException(
                'Director Not Found'
            )
        }


        return this.prisma.director.delete({

            where:{
                id
            },

        });

    }

}