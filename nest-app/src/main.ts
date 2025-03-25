import { NestFactory } from '@nestjs/core';
import { AppDataSource } from './data-source';
import { AppModule } from './app.module';

async function bootstrap() {
  await AppDataSource.initialize()
    .then(() => {
      console.log('Database connected successfully');
    })
    .catch((error) => {
      console.error('Error connecting to the database', error);
    });

  // Start NestJS app
  const app = await NestFactory.create(AppModule);
   // Enable CORS
   app.enableCors({
    origin: 'http://localhost:4000', // Allow requests from your frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
  
}

bootstrap();
