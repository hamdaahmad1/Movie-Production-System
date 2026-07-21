import 
{
    Injectable,
    ConflictException,
    NotFoundException,
    ForbiddenException,
 } from '@nestjs/common';
 import { PrismaService } from '../prisma/prisma.service';
 import { CreateReviewDto } from './dto/create-review.dto';
 @Injectable()
 export class ReviewsService 
 {
    
    constructor(
   private prisma:PrismaService
   ){}
   async create(userId:number,movieId:number,dto:CreateReviewDto)
   {
    const movie =await this.prisma.movie.findUnique({
   
   where:{
   id:movieId
   }
   
   });
   
   if(!movie){
   
   throw new NotFoundException(
   "Movie not found"
   );
   
   }
   const existing = await this.prisma.review.findUnique({
   
   where:{
   userId_movieId:{
    userId,
    movieId
   }
   }
   
   });
   if(existing){
   
   throw new ConflictException(
   "You already reviewed this movie"
   );
   
   }
   return this.prisma.review.create({
   
   data:{
   
   rating:dto.rating,
   comment:dto.comment,
   userId,
   movieId,
   }
   
   });
   
   
   }

   
   async update(userId: number,id: number,dto: CreateReviewDto,) 
   {
  
    const review =await this.prisma.review.findUnique({
  
        where: {
          id,
        },
  
      });
  
  
    if (!review) {
  
      throw new NotFoundException(
        'Review not found',
      );
  
    }
  
  
    if (review.userId !== userId) {
  
      throw new ForbiddenException(
        'You can only update your own review',
      );
  
    }
  
  
    return this.prisma.review.update({
  
      where: {
        id,
      },
  
      data: dto,
  
    });
  
  }


   async remove(user:any,reviewId:number)
   {
   const review = await this.prisma.review.findUnique({
   
   where:{
   id:reviewId
   }
   
   });
   
   
   if(!review){
   
   throw new NotFoundException(
   "Review not found"
   );
   
   }
   
   if (
    user.role !== "ADMIN" &&
    review.userId !== user.id
  ) {
    throw new ForbiddenException(
      "You can only delete your own review"
    );
  }

   return this.prisma.review.delete({
   
   where:{
   id:reviewId
   }
   
   });

}
   async findMovieReviews(movieId:number)
   {
   return this.prisma.review.findMany({
   
   where:{
   movieId
   },
   
   
   include:{
   user:{
   select:{
    id:true,
    username:true
   }
   }
   }
   
   });
   
   
   }


   async getAverageRating(movieId:number)
   {
   const result = await this.prisma.review.aggregate({
   
   where:{
   movieId
   },
   
   _avg:{
   rating:true
   },
   
   _count:{
   rating:true
   }
   
   });
   
   
   return {
   
   averageRating:
   result._avg.rating ?? 0,
   
   totalReviews:
   result._count.rating
   
   };   
   
}

async getMyReviews(userId:number){

    return this.prisma.review.findMany({
   
    where:{
      userId
    },
   
    include:{
      movie:true
    }
   
    });
   
   }
   
}
