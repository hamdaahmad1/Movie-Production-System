import { UpdateDirectorDto } from './dto/update-director.dto';
import { CreateDirectorDto } from './dto/create-director.dto';
import { DirectorsService } from './directors.service';
import { DirectorQueryDto } from './dto/director-query.dto';
import { Query } from '@nestjs/common';

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
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiConsumes,
} from '@nestjs/swagger';

import { Roles } from 'src/auth/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Directors')
@Controller('directors')
export class DirectorsController {
  constructor(
    private directorService: DirectorsService,
  ) {}



  @ApiBearerAuth('JWT-auth')
  @Post()
@Roles('ADMIN','EDITOR')
@ApiOperation({
  summary: 'Create a new director',
  description:
    'Creates a new director with optional profile image upload.',
})
@ApiConsumes('multipart/form-data')
@UseInterceptors(
  FileInterceptor('image'),
)
@ApiBody({
  schema: {
    type: 'object',
    properties: {

      name: {
        type: 'string',
        example: 'Christopher Nolan',
      },

      dob: {
        type: 'string',
        format: 'date',
        example: '1970-07-30',
      },

      gender: {
        type: 'string',
        example: 'Male',
      },

      nationality: {
        type: 'string',
        example: 'British',
      },

      biography: {
        type: 'string',
        example:
          'Director known for Inception and Interstellar.',
      },

      awards: {
        type: 'string',
        example:
          'Academy Award Winner',
      },

      image: {
        type: 'string',
        format: 'binary',
        description:
          'Director profile image (optional)',
      },
    },
  },
})
create(
  @Body() dto: CreateDirectorDto,

  @UploadedFile(
    new ParseFilePipe({
      fileIsRequired: false,
      validators:[
        new MaxFileSizeValidator({
          maxSize:5 * 1024 * 1024,
        }),

        new FileTypeValidator({
          fileType:'image',
        }),
      ],
    }),
  )
  file?: Express.Multer.File,
)
{
  return this.directorService.create(
    dto,
    file,
  );
}

  

  @ApiBearerAuth('JWT-auth')
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
  findAll(
    @Query() query: DirectorQueryDto
  ){
  
    return this.directorService.findAll(query);
  
  }

 

  @ApiBearerAuth('JWT-auth')
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

 

  @ApiBearerAuth('JWT-auth')
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


  @ApiBearerAuth('JWT-auth')
@Roles('ADMIN', 'EDITOR')

@Put(':id')

@ApiOperation({
  summary: 'Fully update a director',
  description:
    'Replaces all director information, including the profile image if provided.',
})

@ApiConsumes('multipart/form-data')

@UseInterceptors(
  FileInterceptor('image'),
)

@ApiParam({
  name: 'id',
  type: Number,
  example: 1,
  description:
    'Unique ID of the director',
})

@ApiBody({
  schema: {
    type: 'object',

    properties: {

      name: {
        type: 'string',
        example: 'Alfonso Cuaron',
      },

      dob: {
        type: 'string',
        format: 'date',
        example: '1961-12-07',
      },

      nationality: {
        type: 'string',
        example: 'Mexican',
      },

      biography: {
        type: 'string',
        example:
          'Mexican filmmaker known for innovative cinematography.',
      },

      image: {
        type: 'string',
        format: 'binary',
        description:
          'Director profile image (optional)',
      },

    },
  },
})


@ApiResponse({
  status:200,
  description:
    'Director successfully updated.',
})


@ApiResponse({
  status:400,
  description:
    'Invalid director data.',
})


@ApiResponse({
  status:404,
  description:
    'Director not found.',
})


update(

  @Param('id', ParseIntPipe)
  id:number,


  @Body()
  dto:CreateDirectorDto,


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

  file?:Express.Multer.File,


){

  return this.directorService.update(
    id,
    dto,
    file,
  );

}


 
  @ApiBearerAuth('JWT-auth')
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