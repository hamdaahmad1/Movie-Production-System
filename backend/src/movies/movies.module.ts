import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
@Module({
  imports: [PrismaModule,CloudinaryModule,],
  providers: [MoviesService],
  controllers: [MoviesController]
})
export class MoviesModule {}
