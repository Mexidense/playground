import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ImageGenerationFromScratchService } from '@playground/image-generation/application/image-generation-from-scratch.service';
import { ImageClient } from '@playground/shared/infrastructure/open-ai/image.client';
import { ImageHttpClient } from '@playground/shared/infrastructure/open-ai/image.http-client';
import { ImageGenerationFromImageService } from '@playground/image-generation/application/image-generation-from-image.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [],
  providers: [
    {
      provide: OpenAI,
      useFactory: (configService: ConfigService) =>
        new OpenAI({
          apiKey: configService.get<string>('OPENAI_API_KEY'),
        }),
      inject: [ConfigService],
    },
    {
      provide: ImageHttpClient,
      useFactory: (openAi: OpenAI) => new ImageHttpClient(openAi),
      inject: [OpenAI],
    },
    {
      provide: ImageGenerationFromScratchService,
      useFactory: (imageGenerationClient: ImageClient) =>
        new ImageGenerationFromScratchService(imageGenerationClient),
      inject: [ImageHttpClient],
    },
    {
      provide: ImageGenerationFromImageService,
      useFactory: (imageGenerationClient: ImageClient) =>
        new ImageGenerationFromImageService(imageGenerationClient),
      inject: [ImageHttpClient],
    },
  ],
})
export class ImageGenerationModule implements OnApplicationBootstrap {
  constructor(
    private readonly imageGenerationFromScratchService: ImageGenerationFromScratchService,
    private readonly imageGenerationFromImageService: ImageGenerationFromImageService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    console.log(`🧠 Generating image...`);

    await this.imageGenerationFromScratchService.generate(
      'Create a cute image about a male mexican engineering developing an assistant GPT bot',
      1,
    );

    await this.imageGenerationFromImageService.editImage(
      'A major town on fire',
      'files/olga_holidays.png',
      1,
    );

    console.log(`🚀 Image generated`);
  }
}
