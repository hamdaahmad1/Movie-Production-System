import {
    Controller,
    Post,
    Delete,
    Get,
    Param,
    Req,
    UseGuards,
   } from '@nestjs/common';
   
   
   import {
    ApiBearerAuth,
    ApiOperation,
    ApiTags,
   } from '@nestjs/swagger';

   import { MovieInteractionsService } from './movie-interactions.service';
   import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
   import { RolesGuard } from '../auth/guards/roles.guard';
   import { Roles } from '../auth/decorators/roles.decorator';
   
   @ApiTags("Movie Interactions")
   @ApiBearerAuth('JWT-auth')
   
   @Controller("movie-interactions")
   @Roles("VIEWER")
   @UseGuards(JwtAuthGuard,RolesGuard)
   
   export class MovieInteractionsController{
   
   
   constructor(
   private service:MovieInteractionsService
   ){}
   
   
   @Post("favorite/:movieId")
   @ApiOperation({
   summary:"Add movie to favorites"
   })
   addFavorite(
   @Req() req:any,
   @Param("movieId") movieId:string
   ){

   return this.service.addFavorite(
    req.user.id,
    Number(movieId)
   
   );
   
   }

   @Delete("favorite/:movieId")
   removeFavorite(
   @Req() req:any,
   @Param("movieId") movieId:string
   
   ){
   
   
   return this.service.removeFavorite(
   
    req.user.id,
    Number(movieId)
   
   );
   
   }

   @Get("favorites")
   getFavorites(
   @Req() req:any
   )
   {
   return this.service.getFavorites(
    req.user.id,
   );
   
   }

   @Post("watchlist/:movieId")
@ApiOperation({
 summary:"Add movie to watchlist"
})
addWatchlist(

@Req() req:any,

@Param("movieId") movieId:string

){

return this.service.addWatchlist(

    req.user.id,

Number(movieId)

);

}

@Delete("watchlist/:movieId")
removeWatchlist(

@Req() req:any,

@Param("movieId") movieId:string

){

return this.service.removeWatchlist(

    req.user.id,

Number(movieId)

);
}
@Get("watchlist")
@ApiOperation({
 summary:"Get user watchlist"
})
getWatchlist(

@Req() req:any

){

return this.service.getWatchlist(
    req.user.id
);

}
}