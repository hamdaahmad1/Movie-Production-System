import { CreateMovieDto } from './dto/create-movie.dto';
import { MoviesService } from './movies.service';
import { UpdateMovieDto } from './dto/update-movie.dto';

import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBody,
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(
    private moviesService: MoviesService,
  ) {}

  // =========================
  // CREATE MOVIE
  // =========================

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @Post()
  @ApiOperation({
    summary: 'Create a new movie',
    description:
      'Creates a movie and associates it with a director and multiple actors.',
  })
  @ApiConsumes('application/json')
  @ApiBody({
    description: 'Movie data with poster URL',
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'Inception',
        },

        duration: {
          type: 'number',
          example: 148,
        },

        genre: {
          type: 'string',
          example: 'Science Fiction',
        },

        rating: {
          type: 'number',
          example: 8.8,
        },

        directorId: {
          type: 'number',
          example: 1,
        },

        description: {
          type: 'string',
          example: 'A skilled thief enters the dreams of others.',
        },

        language: {
          type: 'string',
          example: 'English',
        },

        releaseDate: {
          type: 'string',
          format: 'date',
          example: '2010-07-16',
        },

        trailerId: {
          type: 'string',
          example: 'https://www.youtube.com/watch?v=YoHD_xgiXEw',
        },

        actorIds: {
          type: 'array',
          items: {
            type: 'number',
          },
          example: [1, 2, 3],
        },

        posterPath: {
          type: 'string',
          format: 'uri',
          example: 'https://example.com/inception-poster.jpg',
        },
      },

      required: [
        'title',
        'duration',
        'genre',
        'rating',
        'directorId',
        'description',
        'language',
        'releaseDate',
        'trailerId',
        'actorIds',
        'posterPath',
      ],
    },
  })
  @ApiCreatedResponse({
    description: 'Movie successfully created',
  })
  @ApiBadRequestResponse({
    description: 'Invalid movie data',
  })
  create(@Body() dto: CreateMovieDto) {
    return this.moviesService.create(dto);
  }

  // =========================
  // GET ALL MOVIES
  // =========================

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR', 'VIEWER')
  @Get()
  @ApiOperation({
    summary: 'Get all movies',
    description:
      'Returns a list of all movies with their directors and actors.',
  })
  @ApiResponse({
    status: 200,
    description: 'Movies successfully retrieved',
  })
  findAll() {
    return this.moviesService.findAll();
  }

  // =========================
  // GET ONE MOVIE
  // =========================

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR', 'VIEWER')
  @Get(':id')
  @ApiOperation({
    summary: 'Get a movie by ID',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Movie ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Movie successfully retrieved',
  })
  @ApiNotFoundResponse({
    description: 'Movie not found',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.moviesService.findOne(id);
  }

  // =========================
  // PATCH MOVIE
  // =========================

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @Patch(':id')
  @ApiOperation({
    summary: 'Partially update a movie',
  })
  @ApiConsumes('application/json')
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
  })
  @ApiBody({
    description: 'Movie fields to update',
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'Updated Movie Title',
        },

        duration: {
          type: 'number',
          example: 150,
        },

        genre: {
          type: 'string',
          example: 'Action',
        },

        rating: {
          type: 'number',
          example: 9.0,
        },

        directorId: {
          type: 'number',
          example: 1,
        },

        description: {
          type: 'string',
          example: 'Updated movie description.',
        },

        language: {
          type: 'string',
          example: 'English',
        },

        releaseDate: {
          type: 'string',
          format: 'date',
          example: '2020-01-01',
        },

        trailerId: {
          type: 'string',
          example: 'https://www.youtube.com/watch?v=UpdatedTrailerId',
        },

        actorIds: {
          type: 'array',
          items: {
            type: 'number',
          },
          example: [1, 2],
        },

        posterPath: {
          type: 'string',
          format: 'uri',
          example: 'https://example.com/updated-poster.jpg',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Movie successfully updated',
  })
  @ApiNotFoundResponse({
    description: 'Movie not found',
  })
  partialUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMovieDto,
  ) {
    return this.moviesService.partialUpdate(id, dto);
  }

  // =========================
  // PUT MOVIE
  // =========================

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @Put(':id')
  @ApiOperation({
    summary: 'Replace a movie',
  })
  @ApiConsumes('application/json')
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
  })
  @ApiBody({
    description: 'Complete movie data',
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'Inception',
        },

        duration: {
          type: 'number',
          example: 148,
        },

        genre: {
          type: 'string',
          example: 'Science Fiction',
        },

        rating: {
          type: 'number',
          example: 8.8,
        },

        directorId: {
          type: 'number',
          example: 1,
        },

        description: {
          type: 'string',
          example: 'A skilled thief enters the dreams of others.',
        },

        language: {
          type: 'string',
          example: 'English',
        },

        releaseDate: {
          type: 'string',
          format: 'date',
          example: '2010-07-16',
        },

        trailerId: {
          type: 'string',
          example: 'https://www.youtube.com/watch?v=YoHD_xgiXEw',
        },

        actorIds: {
          type: 'array',
          items: {
            type: 'number',
          },
          example: [1, 2, 3],
        },

        posterPath: {
          type: 'string',
          format: 'uri',
          example: 'https://example.com/inception-poster.jpg',
        },
      },

      required: [
        'title',
        'duration',
        'genre',
        'rating',
        'directorId',
        'description',
        'language',
        'releaseDate',
        'trailerId',
        'actorIds',
        'posterPath',
      ],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Movie successfully replaced',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateMovieDto,
  ) {
    return this.moviesService.update(id, dto);
  }

  // =========================
  // DELETE MOVIE
  // =========================

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a movie',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Movie successfully deleted',
  })
  @ApiNotFoundResponse({
    description: 'Movie not found',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.moviesService.remove(id);
  }
}