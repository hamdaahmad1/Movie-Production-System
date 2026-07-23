import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MoviesModule } from './movies/movies.module';
import { DirectorsModule } from './directors/directors.module';
import { ActorsModule } from './actors/actors.module';
import { AuthModule } from "./auth/auth.module";
import { MovieInteractionsModule } from './movie-interactions/movie-interactions.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UploadModule } from "./uploads/upload.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import{CloudinaryModule} from "./cloudinary/cloudinary.module";

import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
@Module({
  imports: [MoviesModule, DirectorsModule, ActorsModule,PrismaModule,AuthModule,DashboardModule,MovieInteractionsModule,ReviewsModule,UploadModule,CloudinaryModule],
  controllers: [AppController],
  providers: [

    AppService,

    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },

  ],


 
})
export class AppModule {}
