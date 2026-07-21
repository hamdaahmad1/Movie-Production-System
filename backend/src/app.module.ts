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

import { DashboardModule } from "./dashboard/dashboard.module";
@Module({
  imports: [MoviesModule, DirectorsModule, ActorsModule,PrismaModule,AuthModule,DashboardModule,MovieInteractionsModule,ReviewsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
