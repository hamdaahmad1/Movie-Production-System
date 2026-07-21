import { Module } from '@nestjs/common';

import { MovieInteractionsController } from './movie-interactions.controller';
import { MovieInteractionsService } from './movie-interactions.service';

import { PrismaService } from '../prisma/prisma.service';


@Module({
  controllers: [
    MovieInteractionsController,
  ],

  providers: [
    MovieInteractionsService,
    PrismaService,
  ],
})
export class MovieInteractionsModule {}