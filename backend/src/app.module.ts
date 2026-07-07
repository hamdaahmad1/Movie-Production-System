import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MoviesModule } from './movies/movies.module';
import { DirectorsModule } from './directors/directors.module';
import { ActorsModule } from './actors/actors.module';
@Module({
  imports: [MoviesModule, DirectorsModule, ActorsModule,PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
