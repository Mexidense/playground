import { NestFactory } from '@nestjs/core';
import { SequenceDiagramModule } from '@playground/shared/nestjs/sequence-diagram.module';

async function bootstrap() {
  const app = await NestFactory.create(SequenceDiagramModule);
  await app.init();
}

bootstrap();
