import { UpdateMovieDto } from './dto/update-movie.dto';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MoviesService } from './movies.service';
import { Query } from '@nestjs/common';
import { MovieQueryDto } from './dto/movie-query.dto';
import { StandardCrudRoles } from 'src/auth/decorators/standard-crud-roles.decorator';
import * as express from 'express'; 
import { Request } from 'express';

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
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Req,
} from '@nestjs/common';


import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';



import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';



@ApiTags('Movies')
@ApiBearerAuth()
@StandardCrudRoles()
@Controller('movies')

export class MoviesController {

  constructor(
    private moviesService: MoviesService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new movie',
    description:
      'Creates a new movie with an optional poster image upload. ADMIN and EDITOR users can create movies.',
  })

  @ApiConsumes('multipart/form-data')

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "poster", maxCount: 1 },
      { name: "banner", maxCount: 1 },
    ])
  )

  @ApiBody({
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

        actorIds: {
          type: 'array',
          example: [1, 2, 3],
          items: {
            type: 'number',
          },
        },
        
        description: {
          type: 'string',
          example:
            'A skilled thief enters the dreams of others.',
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
          example:
            'https://www.youtube.com/watch?v=YoHD_xgiXEw',
        },

        poster: {
          type: 'string',
          format: 'binary',
          description:
            'Movie poster image (optional)',
        },

        banner: {
          type: "string",
          format: "binary",
          description: "Movie banner image",
        },

      },
    },
  })


  @ApiResponse({
    status: 201,
    description: 'Movie successfully created.',
  })

  @ApiResponse({
    status: 400,
    description: 'Invalid movie data.',
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

    @Body()
    dto: CreateMovieDto,
    @Req() req: any,


    @UploadedFile(

      new ParseFilePipe({

        fileIsRequired:false,

        validators:[

          new MaxFileSizeValidator({
            maxSize:5 * 1024 * 1024,
          }),

          new FileTypeValidator({
            fileType:'image',
          }),

        ],

      })
    )

    files: {
      poster?: Express.Multer.File[];
      banner?: Express.Multer.File[];
    },
    

  ) {

    return this.moviesService.create(
      dto,
      req.user,
      files.poster?.[0],
      files.banner?.[0],
    );

  }






  
  @Get()
  @ApiOperation({
    summary: 'Get all movies',
    description:
      'Returns a list of all movies with their directors and actors.',
  })

  @ApiResponse({
    status: 200,
    description:
      'Movies successfully retrieved.',
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
    @Query() query: MovieQueryDto,
  ) {

    return this.moviesService.findAll(query);

  }



  @Get('genres')
  @ApiOperation({
    summary: 'Get all movie genres',
    description:
      'Returns a list of all available movie genres.',
  })

  @ApiResponse({
    status:200,
    description:
      'Genres successfully retrieved.',
  })

  @ApiResponse({
    status:500,
    description:
      'Internal server error.',
  })

  getGenres() {

    return this.moviesService.getGenres();

  }


  @Get(':id')
  @ApiOperation({
    summary: 'Get a movie by ID',
    description:
      'Returns a single movie using the movie ID.',
  })

  @ApiParam({
    name:'id',
    type:Number,
    example:1,
    description:
      'Unique ID of the movie',
  })

  @ApiResponse({
    status:200,
    description:
      'Movie successfully retrieved.',
  })

  @ApiResponse({
    status:404,
    description:
      'Movie not found.',
  })

  @ApiResponse({
    status:401,
    description:
      'Unauthorized. JWT token is missing or invalid.',
  })


  findOne(
    @Param('id', ParseIntPipe) id:number,
  ) {

    return this.moviesService.findOne(id);

  }




  @Patch(':id')
  @ApiOperation({
    summary:'Partially update a movie',
    description:
      'Updates one or more movie fields, including the poster image if provided.',
  })

  @ApiConsumes('multipart/form-data')


  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "poster", maxCount: 1 },
      { name: "banner", maxCount: 1 },
    ])
  )


  @ApiParam({
    name:'id',
    type:Number,
    example:1,
    description:
      'Unique ID of the movie',
  })


  @ApiBody({
    schema:{
      type:'object',

      properties:{

        title:{
          type:'string',
          example:'Inception',
        },

        duration:{
          type:'number',
          example:148,
        },

        genre:{
          type:'string',
          example:'Science Fiction',
        },

        rating:{
          type:'number',
          example:8.8,
        },

        poster:{
          type:'string',
          format:'binary',
          description:
            'Movie poster image (optional)',
        },

        banner: {
          type: "string",
          format: "binary",
        },

      },
    },
  })


  @ApiResponse({
    status:200,
    description:
      'Movie successfully updated.',
  })


  @ApiResponse({
    status:404,
    description:
      'Movie not found.',
  })



  partialUpdate(@Param('id', ParseIntPipe) 
  id:number,


    @Body()
    dto:UpdateMovieDto,


    @UploadedFile(
      new ParseFilePipe({

        fileIsRequired:false,

        validators:[

          new MaxFileSizeValidator({
            maxSize:5 * 1024 * 1024,
          }),

          new FileTypeValidator({
            fileType:'image',
          }),

        ],

      })
    )

    files: {
      poster?: Express.Multer.File[];
      banner?: Express.Multer.File[];
    },


  ) {


    return this.moviesService.partialUpdate(
      id,
      dto,
      files.poster?.[0],
      files.banner?.[0],
    );


  }





  @ApiBearerAuth('JWT-auth')
  @Put(':id')
  @ApiOperation({
    summary: 'Fully update a movie',
    description:
      'Updates movie information with optional poster image upload.',
  })
  
  @ApiConsumes('multipart/form-data')
  
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "poster", maxCount: 1 },
      { name: "banner", maxCount: 1 },
    ])
  )
  
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Unique ID of the movie',
  })
  
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
  
        title: {
          type: 'string',
          example: 'Interstellar',
        },
  
        description: {
          type: 'string',
          example:
            'A science fiction movie about space exploration.',
        },
  
        releaseDate: {
          type: 'string',
          format: 'date',
          example: '2014-11-07',
        },
  
        duration: {
          type: 'number',
          example: 169,
        },
  
        genre: {
          type: 'string',
          example: 'Science Fiction',
        },
  
        language: {
          type: 'string',
          example: 'English',
        },
  
        rating: {
          type: 'number',
          example: 8.7,
        },
  
        trailerId: {
          type: 'string',
          example:
            'https://youtube.com/watch?v=xxxx',
        },
  
        posterPath: {
          type: 'string',
          example:
            'old-cloudinary-url',
        },
        banner: {
          type: "string",
          format: "binary",
          description: "Movie banner image",
        },
  
        directorId: {
          type: 'number',
          example: 1,
        },
  
        actorIds: {
          type: 'string',
          example:
            '[1,2,3]',
          description:
            'JSON string array of actor IDs',
        },
  
        poster: {
          type: 'string',
          format: 'binary',
          description:
            'Movie poster image',
        },
  
      },
    },
  })
  
  
  @ApiResponse({
    status: 200,
    description:
      'Movie successfully updated.',
  })
  
  
  @ApiResponse({
    status: 400,
    description:
      'Invalid movie data.',
  })
  
  
  @ApiResponse({
    status: 404,
    description:
      'Movie not found.',
  })
  
  
  update(
  
    @Param('id', ParseIntPipe)
    id: number,
  
  
    @Body()
    dto: CreateMovieDto,
  
  
    @UploadedFile(
      new ParseFilePipe({
  
        fileIsRequired: false,
  
        validators: [
  
          new MaxFileSizeValidator({
            maxSize: 5 * 1024 * 1024,
          }),
  
  
          new FileTypeValidator({
            fileType: 'image',
          }),
  
        ],
  
      }),
    )
    files: {
      poster?: Express.Multer.File[];
      banner?: Express.Multer.File[];
    },
  
  ) {
  
    return this.moviesService.update(
      id,
      dto,
      files?.poster?.[0],
      files?.banner?.[0],
    );
  
  }









  @Delete(':id')
  @ApiOperation({
    summary:'Delete a movie',
    description:
      'Deletes a movie. Only ADMIN users are allowed to perform this operation.',
  })


  @ApiParam({
    name:'id',
    type:Number,
    example:1,
    description:
      'Unique ID of the movie',
  })


  @ApiResponse({
    status:200,
    description:
      'Movie successfully deleted.',
  })


  @ApiResponse({
    status:404,
    description:
      'Movie not found.',
  })


  @ApiResponse({
    status:401,
    description:
      'Unauthorized. JWT token is missing or invalid.',
  })


  @ApiResponse({
    status:403,
    description:
      'Forbidden. Only ADMIN users can delete movies.',
  })



  remove(
    @Param('id', ParseIntPipe) id:number,
    @Req() req: any,
  ) {

    return this.moviesService.remove(id, req.user);

  }


}