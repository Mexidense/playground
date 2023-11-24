import { NestFactory } from '@nestjs/core';
import { AssistantModule } from '@playground/assistant/infrastructure/nestjs/module/assistant.module';

async function bootstrap() {
  const app = await NestFactory.create(AssistantModule);
  await app.init();
}

bootstrap();
