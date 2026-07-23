import { UpdateActorDto } from './dto/update-actor.dto';
import { CreateActorDto } from './dto/create-actor.dto';
import { ActorsService } from './actors.service';
import { Query } from '@nestjs/common';
import { ActorQueryDto } from './dto/actor-query.dto';

import {
  Controller,
  Post,
  Put,
  Patch,
  Get,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('Actors')
@Controller('actors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard,RolesGuard)
export class ActorsController {
  constructor(
    private actorService: ActorsService,
  ) {}

  


  @Roles('ADMIN')
  @Post()
  @ApiOperation({
    summary: 'Create a new actor',
    description:
      'Creates a new actor. ADMIN and EDITOR users can create actors.',
  })
  @ApiBody({
    type: CreateActorDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Actor successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid actor data.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized. JWT token is missing or invalid.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden. User does not have permission.',
  })
  create(
    @Body() dto: CreateActorDto,
  ) {
    return this.actorService.create(dto);
  }

  
  
  @Roles('ADMIN', 'EDITOR', 'VIEWER')
  @Get()
  @ApiOperation({
    summary: 'Get all actors',
    description:
      'Returns a list of all actors. ADMIN, EDITOR, and VIEWER users can access this endpoint.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Actors successfully retrieved.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized. JWT token is missing or invalid.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden. User does not have permission.',
  })
  findAll(
    @Query() query: ActorQueryDto,
  ) {
    return this.actorService.findAll(query);
  }

 

 
  @Roles('ADMIN', 'EDITOR', 'VIEWER')
  @Get(':id')
  @ApiOperation({
    summary: 'Get an actor by ID',
    description:
      'Returns a single actor using the actor ID.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Unique ID of the actor',
  })
  @ApiResponse({
    status: 200,
    description:
      'Actor successfully retrieved.',
  })
  @ApiResponse({
    status: 404,
    description: 'Actor not found.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized. JWT token is missing or invalid.',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.actorService.findOne(id);
  }

  

  
  @Roles('ADMIN', 'EDITOR')
  @Patch(':id')
  @ApiOperation({
    summary: 'Partially update an actor',
    description:
      'Updates one or more actor fields, including the image URL if provided.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Unique ID of the actor',
  })
  @ApiBody({
    type: UpdateActorDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Actor successfully updated.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid actor data.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Actor not found.',
  })
  partialUpdate(
    @Param('id', ParseIntPipe) id: number,

    @Body() dto: UpdateActorDto,
  ) {
    return this.actorService.partialUpdate(
      id,
      dto,
    );
  }

  

  
  @Roles('ADMIN', 'EDITOR')
  @Put(':id')
  @ApiOperation({
    summary: 'Fully update an actor',
    description:
      'Replaces all actor information, including the image URL.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Unique ID of the actor',
  })
  @ApiBody({
    type: CreateActorDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Actor successfully updated.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid actor data.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Actor not found.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,

    @Body() dto: CreateActorDto,
  ) {
    return this.actorService.update(
      id,
      dto,
    );
  }



  
  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an actor',
    description:
      'Deletes an actor. Only ADMIN users are allowed to perform this operation.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Unique ID of the actor',
  })
  @ApiResponse({
    status: 200,
    description:
      'Actor successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Actor not found.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized. JWT token is missing or invalid.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden. Only ADMIN users can delete actors.',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.actorService.remove(id);
  }
}