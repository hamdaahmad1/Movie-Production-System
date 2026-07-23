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
  UploadedFile,
   UseInterceptors,
    ParseFilePipe,
   MaxFileSizeValidator,
   FileTypeValidator
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


import { Roles } from 'src/auth/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';


@ApiTags('Actors')
@Controller('actors')
@ApiBearerAuth()
export class ActorsController {
  constructor(
    private actorService: ActorsService,
  ) {}

  

  @Post()
@Roles('ADMIN','EDITOR')

@ApiOperation({
  summary: 'Create a new actor',
  description:
    'Creates a new actor with an optional profile image upload. ADMIN and EDITOR users can create actors.',
})

@ApiConsumes('multipart/form-data')

@UseInterceptors(
  FileInterceptor('image')
)

@ApiBody({
  schema: {
    type: 'object',

    properties: {

      name: {
        type: 'string',
        example: 'Cillian Murphy',
      },

      dob: {
        type: 'string',
        format: 'date',
        example: '1980-05-25',
      },

      gender: {
        type: 'string',
        example: 'Male',
      },

      nationality: {
        type: 'string',
        example: 'Irish',
      },

      biography: {
        type: 'string',
        example:
          'Irish actor known for Peaky Blinders and Oppenheimer.',
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
          'Actor profile image (optional)',
      },

    },
  },
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
  @Body()
  dto: CreateActorDto,

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
  file?: Express.Multer.File,


  

) {

  return this.actorService.create(
    dto,
    file,
  );

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
    'Updates one or more actor fields, including the profile image if provided.',
})
@ApiConsumes('multipart/form-data')
@UseInterceptors(
  FileInterceptor('image'),
)
@ApiParam({
  name: 'id',
  type: Number,
  example: 1,
  description: 'Unique ID of the actor',
})
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        example: 'Cillian Murphy',
      },

      dateOfBirth: {
        type: 'string',
        format: 'date',
        example: '1980-05-25',
      },

      gender: {
        type: 'string',
        example: 'Male',
      },

      nationality: {
        type: 'string',
        example: 'Irish',
      },

      biography: {
        type: 'string',
        example:
          'Irish actor known for Peaky Blinders and Oppenheimer.',
      },

      awards: {
        type: 'string',
        example: 'Academy Award Winner',
      },

      image: {
        type: 'string',
        format: 'binary',
        description: 'Actor profile image (optional)',
      },
    },
  },
})
@ApiResponse({
  status: 200,
  description: 'Actor successfully updated.',
})
@ApiResponse({
  status: 400,
  description: 'Invalid actor data.',
})
@ApiResponse({
  status: 404,
  description: 'Actor not found.',
})
partialUpdate(
  @Body() dto: UpdateActorDto,
  @Param('id', ParseIntPipe) id: number,

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
  file?: Express.Multer.File,
) {
  return this.actorService.partialUpdate(
    id,
    dto,
    file,
  );
}

  

  
@Roles('ADMIN', 'EDITOR')
@Put(':id')
@ApiOperation({
  summary: 'Fully update an actor',
  description:
    'Replaces all actor information, including the profile image if provided.',
})
@ApiConsumes('multipart/form-data')
@UseInterceptors(
  FileInterceptor('image'),
)
@ApiParam({
  name: 'id',
  type: Number,
  example: 1,
  description: 'Unique ID of the actor',
})
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        example: 'Cillian Murphy',
      },

      dateOfBirth: {
        type: 'string',
        format: 'date',
        example: '1980-05-25',
      },

      gender: {
        type: 'string',
        example: 'Male',
      },

      nationality: {
        type: 'string',
        example: 'Irish',
      },

      biography: {
        type: 'string',
        example:
          'Irish actor known for Peaky Blinders and Oppenheimer.',
      },

      awards: {
        type: 'string',
        example: 'Academy Award Winner',
      },

      image: {
        type: 'string',
        format: 'binary',
        description: 'Actor profile image (optional)',
      },
    },

    required: [
      'name',
      'dateOfBirth',
      'gender',
      'nationality',
      'biography',
    ],
  },
})
@ApiResponse({
  status: 200,
  description: 'Actor successfully updated.',
})
@ApiResponse({
  status: 400,
  description: 'Invalid actor data.',
})
@ApiResponse({
  status: 404,
  description: 'Actor not found.',
})
update(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: CreateActorDto,

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
  file?: Express.Multer.File,

  
) {
  return this.actorService.update(
    id,
    file,
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