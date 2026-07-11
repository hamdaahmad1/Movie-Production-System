import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';

import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class ActorsService {
 constructor(private prisma: PrismaService){}

 async create(dto: CreateActorDto) {
    if (new Date(dto.dob) > new Date()) {
      throw new BadRequestException(
        'Date of birth cannot be in the future',
      );
    }

    return this.prisma.actor.create({
      data: {
        name: dto.name,
        dob: new Date(dto.dob),
        nationality: dto.nationality,
        gender:dto.gender,
        biography: dto.biography,
        awards: dto.awards,
        imageUrl: dto.imageUrl,
      },
    });
  }

  async findAll() {
    return this.prisma.actor.findMany({
      include: {
        movies: true,
      },
    });
  }

  async findOne(id: number) {
    const actor = await this.prisma.actor.findUnique({
      where: { id },
      include: {
        movies: true,
      },
    });

    if (!actor) {
      throw new NotFoundException('Actor not found');
    }

    return actor;
  }

  
  async update(id: number, dto: CreateActorDto) {
    const actor = await this.prisma.actor.findUnique({
      where: { id },
    });

    if (!actor) {
      throw new NotFoundException('Actor not found');
    }

    if (new Date(dto.dob) > new Date()) {
      throw new BadRequestException(
        'Date of birth cannot be in the future',
      );
    }

    return this.prisma.actor.update({
      where: { id },
      data: {
        name: dto.name,
        dob: new Date(dto.dob),
        nationality: dto.nationality,
        gender: dto.gender,
        biography: dto.biography,
        awards: dto.awards,
        imageUrl: dto.imageUrl,
      },
    });
  }

  // PATCH (Partial Update)
  async partialUpdate(id: number, dto: UpdateActorDto) {
    const actor = await this.prisma.actor.findUnique({
      where: { id },
    });

    if (!actor) {
      throw new NotFoundException('Actor not found');
    }

    if (dto.dob && new Date(dto.dob) > new Date()) {
      throw new BadRequestException(
        'Date of birth cannot be in the future',
      );
    }

    return this.prisma.actor.update({
      where: { id },
      data: {
        name: dto.name,
        dob: dto.dob ? new Date(dto.dob) : undefined,
        nationality: dto.nationality,
        gender: dto.gender,
        biography: dto.biography,
        awards: dto.awards,
        imageUrl: dto.imageUrl,
      },
    });
  }

  async remove(id: number) {
    const actor = await this.prisma.actor.findUnique({
      where: { id },
    });

    if (!actor) {
      throw new NotFoundException('Actor not found');
    }

    return this.prisma.actor.delete({
      where: { id },
    });
  }

}
