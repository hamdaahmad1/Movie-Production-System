import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
  } from '@nestjs/common';
  
  import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
  } from '@nestjs/swagger';
  
  import { ReviewsService } from './reviews.service';
  
  import { CreateReviewDto } from './dto/create-review.dto';
  
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
  
  @ApiTags('Reviews')
  
  @Controller('reviews')
  
  @ApiBearerAuth('JWT-auth')
  
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  export class ReviewsController {
    constructor(
      private readonly reviewsService: ReviewsService,
    ) {}
  
    @Post('movie/:movieId')
    @Roles('VIEWER')
    @ApiOperation({
      summary: 'Create review',
      description:
        'Allows a VIEWER to review a movie.',
    })
    @ApiParam({
      name: 'movieId',
      example: 1,
    })
    @ApiResponse({
      status: 201,
      description: 'Review created successfully.',
    })
    create(
      @Req() req: any,
  
      @Param('movieId') movieId: string,
  
      @Body() dto: CreateReviewDto,
    ) {
      return this.reviewsService.create(
        req.user.id,
        Number(movieId),
        dto,
      );
    }


  
    @Patch(':id')
@Roles('ADMIN')
@ApiOperation({
  summary: 'Admin update review',
})
@ApiParam({
  name: 'id',
  example: 1,
})
update(
 @Param('id') id:string,
 @Body() dto:CreateReviewDto,
){
 return this.reviewsService.update(
   Number(id),
   dto,
 );
}

  
    @Delete(':id')
    @Roles('VIEWER','ADMIN')
    @ApiOperation({
      summary: 'Delete review',
    })
    @ApiParam({
      name: 'id',
      example: 1,
    })
    remove(
      @Req() req: any,
  
      @Param('id') id: string,
    ) {
      return this.reviewsService.remove(
        req.user,
        Number(id),
      );
    }
  
    @Get('movie/:movieId')
    @Roles(
      'ADMIN',
      'EDITOR',
      'VIEWER',
    )
    @ApiOperation({
      summary: 'Get movie reviews',
    })
    @ApiParam({
      name: 'movieId',
      example: 1,
    })
    findMovieReviews(
      @Param('movieId') movieId: string,
    ) {
      return this.reviewsService.findMovieReviews(
        Number(movieId),
      );
    }

    
    @Get("my-reviews")
    @Roles("VIEWER")
@UseGuards(JwtAuthGuard)
@ApiOperation({
  summary: "Get reviews written by logged-in user"
})
@ApiResponse({
  status: 200,
  description: "User reviews fetched successfully"
})
@ApiResponse({
  status: 401,
  description: "Unauthorized"
})
getMyReviews(
  @Req() req:any
){
  return this.reviewsService.getMyReviews(
    req.user.id
  );
}

    @Get(":id")
@Roles("ADMIN")
@ApiOperation({
  summary: "Get review by id",
})
findOne(
  @Param("id") id: string,
) {
  return this.reviewsService.findOne(Number(id));
}

  
    @Get('movie/:movieId/rating')
    @Roles(
      'ADMIN',
      'EDITOR',
      'VIEWER',
    )
    @ApiOperation({
      summary: 'Get average movie rating',
    })
    @ApiParam({
      name: 'movieId',
      example: 1,
    })
    getAverageRating(
      @Param('movieId') movieId: string,
    ) {
      return this.reviewsService.getAverageRating(
        Number(movieId),
      );
    }





  }