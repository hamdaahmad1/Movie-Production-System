import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MoviesModule } from './movies/movies.module';
import { DirectorsModule } from './directors/directors.module';
@Module({
  imports: [MoviesModule, DirectorsModule],
  controllers: [AppController],
  providers: [AppService],
})
@Module({
  imports: [PrismaModule],
})
export class AppModule {}
