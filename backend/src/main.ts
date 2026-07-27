import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';

import cookieParser from 'cookie-parser';
import { join } from 'path';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );


  // Serve uploaded images/files
  app.useStaticAssets(
    join(__dirname, '..', 'uploads'),
    {
      prefix: '/uploads/',
    },
  );


  // Read cookies (JWT stored in cookies)
  app.use(cookieParser());


  // Global DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalGuards(
    new JwtAuthGuard(app.get(Reflector)),
    new RolesGuard(app.get(Reflector))
   );


  // Allow frontend communication
  app.enableCors({
    origin: "http://localhost:3000",
    credentials: true,
  });


  // Swagger Configuration
  const config = new DocumentBuilder()

    .setTitle('Movie Management API')

    .setDescription(
      'Movie Management Backend API',
    )

    .setVersion('1.0')

    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'JWT-auth',
    )

    .build();



  const document = SwaggerModule.createDocument(
    app,
    config,
  );


  SwaggerModule.setup(
    'api',
    app,
    document,
  );


  await app.listen(
    process.env.PORT ?? 3001,
  );
}


bootstrap();