import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ImageGenerationService } from '@playground/image-generation/application/image-generation.service';
import { ImageClient } from '@playground/shared/infrastructure/open-ai/image.client';
import { ImageHttpClient } from '@playground/shared/infrastructure/open-ai/image.http-client';

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
      provide: ImageGenerationService,
      useFactory: (imageGenerationClient: ImageClient) =>
        new ImageGenerationService(imageGenerationClient),
      inject: [ImageHttpClient],
    },
  ],
})
export class ImageGenerationModule implements OnApplicationBootstrap {
  constructor(
    private readonly imageGenerationService: ImageGenerationService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    console.log(`🧠 Generating image...`);

    await this.imageGenerationService.generate(
      'Create a cute image about a male mexican engineering developing an assistant GPT bot',
      1,
    );

    console.log(`🚀 Image generated`);
  }
}
