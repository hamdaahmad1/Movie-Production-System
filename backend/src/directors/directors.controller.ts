import { UpdateDirectorDto } from './dto/update-director.dto';
import { CreateDirectorDto } from './dto/create-director.dto';
import { DirectorsService } from './directors.service';

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

@ApiTags('Directors')
@Controller('directors')
export class DirectorsController {
  constructor(
    private directorService: DirectorsService,
  ) {}

  // =========================
  // CREATE DIRECTOR
  // =========================

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @Post()
  @ApiOperation({
    summary: 'Create a new director',
    description:
      'Creates a new director. ADMIN and EDITOR users can create directors.',
  })
  @ApiBody({
    type: CreateDirectorDto,
  })
  @ApiResponse({
    status: 201,
    description:
      'Director successfully created.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid director data.',
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
    @Body() dto: CreateDirectorDto,
  ) {
    return this.directorService.create(
      dto,
    );
  }

  // =========================
  // GET ALL DIRECTORS
  // =========================

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR', 'VIEWER')
  @Get()
  @ApiOperation({
    summary: 'Get all directors',
    description:
      'Returns all directors. ADMIN, EDITOR, and VIEWER users can access this endpoint.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Directors successfully retrieved.',
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
  findAll() {
    return this.directorService.findAll();
  }

  // =========================
  // GET ONE DIRECTOR
  // =========================

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR', 'VIEWER')
  @Get(':id')
  @ApiOperation({
    summary: 'Get a director by ID',
    description:
      'Returns a single director using the director ID.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description:
      'Unique ID of the director',
  })
  @ApiResponse({
    status: 200,
    description:
      'Director successfully retrieved.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid director ID.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized. JWT token is missing or invalid.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Director not found.',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.directorService.findOne(
      id,
    );
  }

  // =========================
  // PARTIAL UPDATE DIRECTOR
  // =========================

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @Patch(':id')
  @ApiOperation({
    summary: 'Partially update a director',
    description:
      'Updates one or more director fields, including the image URL if provided.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description:
      'Unique ID of the director',
  })
  @ApiBody({
    type: UpdateDirectorDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Director successfully updated.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid director data.',
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
  @ApiResponse({
    status: 404,
    description:
      'Director not found.',
  })
  partialUpdate(
    @Param('id', ParseIntPipe) id: number,

    @Body() dto: UpdateDirectorDto,
  ) {
    return this.directorService.partialUpdate(
      id,
      dto,
    );
  }

  // =========================
  // FULL UPDATE DIRECTOR
  // =========================

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @Put(':id')
  @ApiOperation({
    summary: 'Fully update a director',
    description:
      'Replaces all director information, including the image URL.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description:
      'Unique ID of the director',
  })
  @ApiBody({
    type: CreateDirectorDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Director successfully updated.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid director data.',
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
  @ApiResponse({
    status: 404,
    description:
      'Director not found.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,

    @Body() dto: CreateDirectorDto,
  ) {
    return this.directorService.update(
      id,
      dto,
    );
  }

  // =========================
  // DELETE DIRECTOR
  // =========================

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a director',
    description:
      'Deletes a director. Only ADMIN users can perform this operation.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description:
      'Unique ID of the director',
  })
  @ApiResponse({
    status: 200,
    description:
      'Director successfully deleted.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid director ID.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized. JWT token is missing or invalid.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden. Only ADMIN users can delete directors.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Director not found.',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.directorService.remove(
      id,
    );
  }
}