import {
    Injectable,
    NotFoundException,
    ConflictException,
  } from '@nestjs/common';
  
  
  import { PrismaService } from '../prisma/prisma.service';
  
  
  @Injectable()
  export class MovieInteractionsService {
  
  constructor(
   private prisma: PrismaService,
  ){}
  
  async addFavorite(
   userId:number,
   movieId:number,
  ){
  
  
  const movie =
  await this.prisma.movie.findUnique({
  
   where:{
    id:movieId,
   }
  
  });
  
  
  if(!movie){
  
   throw new NotFoundException(
    "Movie not found"
   );
  
  }
  
  const existing =
  await this.prisma.movieInteraction.findFirst({
  
  where:{
   userId,
   movieId,
   type:"FAVORITE",
  }
  
  });
  
  
  if(existing){
  
   throw new ConflictException(
    "Movie already added to favorites"
   );
  
  }
  
  
  
  return this.prisma.movieInteraction.create({
  
  data:{
  
   userId,
  
   movieId,
  
   type:"FAVORITE",
  
  }
  
  });
  
  
  }
  async removeFavorite(
   userId:number,
   movieId:number,
  ){
  
  
  const favorite =
  await this.prisma.movieInteraction.findFirst({
  
  where:{
  
   userId,
  
   movieId,
  
   type:"FAVORITE",
  
  }
  
  });
  
  
  if(!favorite){
  
   throw new NotFoundException(
    "Favorite not found"
   );
  
  }

  return this.prisma.movieInteraction.delete({
  
  where:{
   id:favorite.id,
  }
  
  });
  
  
  }
  
  async getFavorites(
   userId:number,
  ){
  return this.prisma.movieInteraction.findMany({
  
  where:{
  
   userId,
  
   type:"FAVORITE",
  
  },
  include:{
  
   movie:true,
  
  },});
  
  }
  async addWatchlist(
    userId:number,
    movieId:number,
  ){
  
  const movie =
  await this.prisma.movie.findUnique({
  
  where:{
   id:movieId,
  }
  
  });

  if(!movie){
  
   throw new NotFoundException(
    "Movie not found"
   );
  
  }
  const existing =
  await this.prisma.movieInteraction.findFirst({
  
  where:{
  
   userId,
   movieId,
  type:"WATCHLIST",
  
  }
  
  });
  if(existing){
  
   throw new ConflictException(
    "Movie already in watchlist"
   );
  
  }
  return this.prisma.movieInteraction.create({
  
  data:{
  userId,
  movieId,
  type:"WATCHLIST",

  }
  });
  }

  async removeWatchlist(
    userId:number,
    movieId:number,
   ){
   
   
   const item =
   await this.prisma.movieInteraction.findFirst({
   
   where:{
   
    userId,
   
    movieId,
   
    type:"WATCHLIST",
   
   }
   
   });
   
   
   if(!item){
   
   throw new NotFoundException(
   "Movie not found in watchlist"
   );
   
   }
  
   return this.prisma.movieInteraction.delete({
   
   where:{
    id:item.id,
   }
   
   });
   
   
   }
   async getWatchlist(
    userId:number,
   ){
   
   
   return this.prisma.movieInteraction.findMany({
   
   where:{
   
    userId,
   
    type:"WATCHLIST",
   
   },
   
   
   include:{
   
    movie:true,
   
   }
   
   });
   }
  }