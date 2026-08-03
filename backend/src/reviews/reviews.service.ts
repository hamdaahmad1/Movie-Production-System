import 
{
    Injectable,
    ConflictException,
    NotFoundException,
    ForbiddenException,
    Logger
 } from '@nestjs/common';
 import { PrismaService } from '../prisma/prisma.service';
 import { CreateReviewDto } from './dto/create-review.dto';
 @Injectable()
 export class ReviewsService 
 {
  private readonly logger = new Logger(ReviewsService.name);
    
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
   
    this.logger.error("Movie not found");
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
   this.logger.error("You already reviewed this movie");
   throw new ConflictException(
   "You already reviewed this movie"
   );
   
   }
   const review= await this.prisma.review.create({
   
   data:{
   
   rating:dto.rating,
   comment:dto.comment,
   userId,
   movieId,
   }
   
   });
   this.logger.log("Review created successfully");
   return review;
   
   
   }

   
   async update(
    id:number,
    dto:CreateReviewDto,
   ){
    const updatedReview= await this.prisma.review.update({
      where:{
        id,
      },
      data:{
        rating:dto.rating,
        comment:dto.comment,
      },
    });
    this.logger.log("Review updated successfully");
    return updatedReview;
   }

   
  async findOne(id: number) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });
  
    if (!review) {
      this.logger.error("Review not found");
      throw new NotFoundException("Review not found");
    }
  
    return review;
  }


   async remove(user:any,reviewId:number)
   {
   const review = await this.prisma.review.findUnique({
   
   where:{
        id:reviewId
   }
   
   });
   
   
   if(!review){
   this.logger.error("Review not found");
   throw new NotFoundException(
   "Review not found"
   );
   
   }
   
   if (
    user.role !== "ADMIN" &&
    review.userId !== user.id
  ) {
    this.logger.error("You can only delete your own review");
    throw new ForbiddenException(
      "You can only delete your own review"
    );
  }

   const deletedReview= await this.prisma.review.delete({
   
   where:{
       id:reviewId
   }
   
   });
   this.logger.log("Review deleted successfully");
   return deletedReview;

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
