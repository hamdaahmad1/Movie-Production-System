import { Module } from '@nestjs/common';
import { DirectorsController } from './directors.controller';
import { DirectorsService } from './directors.service';
import { PrismaModule} from 'src/prisma/prisma.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule,CloudinaryModule],
  controllers: [DirectorsController],
  providers: [DirectorsService]
})
export class DirectorsModule {}
