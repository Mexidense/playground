import { NestFactory } from '@nestjs/core';
import { SequenceDiagramGenerateDocumentationModule } from '@playground/shared/nestjs/sequence-diagram.generate-documentation.module';

async function bootstrap() {
  const app = await NestFactory.create(
    SequenceDiagramGenerateDocumentationModule,
  );
  await app.init();
}

bootstrap();
