import { NestFactory } from '@nestjs/core';
import { AssistantModule } from '@playground/shared/nestjs/assistant.module';

async function bootstrap() {
  const app = await NestFactory.create(AssistantModule);
  await app.init();
}

bootstrap();
