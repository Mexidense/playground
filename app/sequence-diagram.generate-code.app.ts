import { NestFactory } from '@nestjs/core';
import { SequenceDiagramGenerateCodeModule } from '@playground/shared/nestjs/sequence-diagram.generate-code.module';

async function bootstrap() {
  const app = await NestFactory.create(SequenceDiagramGenerateCodeModule);
  await app.init();
}

bootstrap();
