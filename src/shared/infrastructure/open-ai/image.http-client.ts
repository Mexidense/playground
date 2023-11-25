import { ImageClient } from '@playground/shared/infrastructure/open-ai/image.client';
import OpenAI from 'openai';

export class ImageHttpClient implements ImageClient {
  constructor(private readonly openai: OpenAI) {}

  async generateImages(
    prompt: string,
    numberOfImages: number = 1,
  ): Promise<string[]> {
    const images = await this.openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: numberOfImages,
    });

    if (!images.data) {
      return Promise.resolve([]);
    }

    return Promise.resolve(images.data.map((image) => image.url));
  }
}
