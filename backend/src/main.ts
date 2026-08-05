import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

import { ValidationPipe } from '@nestjs/common';

import cookieParser from 'cookie-parser';

import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  app.useGlobalInterceptors(
    new ResponseInterceptor()
   );
   app.useGlobalFilters(
    new HttpExceptionFilter(),
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
 // Allow frontend communication
 app.enableCors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://movie-production-system.vercel.app',
      'https://morally-press-easiness.ngrok-free.dev'
    ];
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /\.vercel\.app$/.test(origin) ||
      /\.ngrok-free\.dev$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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


  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}


bootstrap();