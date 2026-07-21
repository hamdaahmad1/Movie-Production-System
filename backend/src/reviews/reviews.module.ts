import { Module } from '@nestjs/common';

import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports:[
        PrismaModule,
      ],
  controllers: [ReviewsController],

  providers: [
    ReviewsService,
    PrismaService,
  ],
})
export class ReviewsModule {}