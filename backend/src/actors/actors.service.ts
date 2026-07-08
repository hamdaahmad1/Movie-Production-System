import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';

import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class ActorsService {
 constructor(private prisma: PrismaService){}

 async create(dto: CreateActorDto)
 {
    const DateOfBirth = new Date();
    if(new Date(dto.dob) > DateOfBirth)
    {
        throw new BadRequestException(
            'Date of Birth cannot be in future'
        )
    }

    return this.prisma.actor.create({
        data:{

            name: dto.name,
            dob: new Date(dto.dob),
            nationality:dto.nationality, 
        }
    })


 }

 async findAll(){

    return this.prisma.actor.findMany(
    {

        include:{
            movies :true 
        }
    });


 }

 async findOne(id: number)
 {
     const actor = await this.prisma.actor.findUnique({
        where:{
            id
        },
        include:{
            movies: true
        },
     });

     if(!actor)
     {
        throw new BadRequestException(
            'Actor does not exist'
        )
     }
     return actor;

 }
 async update (id:number, dto:CreateActorDto)
    {
        if(dto.dob){
            const DOB= new Date();
    

        if(new Date(dto.dob) >DOB)
        {
            throw new BadRequestException(
                'Date of birth cannot be in the future'
            );

        }
        
    }
    return this.prisma.actor.update({
        where:{
            id
        },
        data:
        {
            name:dto.name,
            dob: dto.dob? new Date(dto.dob) :undefined,
            nationality:dto.nationality,
        },
    });
    }

 async partialUpdate (id:number, dto:UpdateActorDto)
    {
        if(dto.dob){
            const DOB= new Date();
    

        if(new Date(dto.dob) >DOB)
        {
            throw new BadRequestException(
                'Date of birth cannot be in the future'
            );

        }
        
    }
    return this.prisma.actor.update({
        where:{
            id
        },
        data:
        {
            name:dto.name,
            dob: dto.dob? new Date(dto.dob) :undefined,
            nationality:dto.nationality,
        },
    });
    }

    async remove(id:number)
    {
        const actor= await this.prisma.actor.findUnique({
            where:{
                id
            },


        });

        if(!actor)
        {
            throw new BadRequestException(
                'Actor Not Found'
            )
        }
        return this.prisma.actor.delete({
            where:{
                id
            },
        });
    }

}
