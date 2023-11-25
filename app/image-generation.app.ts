import { NestFactory } from '@nestjs/core';
import { ImageGenerationModule } from '@playground/shared/nestjs/image-generation.module';

async function bootstrap() {
  const app = await NestFactory.create(ImageGenerationModule);
  await app.init();
}

bootstrap();
