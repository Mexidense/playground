import { ImageClient } from '@playground/shared/open-ai/image.client';
import OpenAI from 'openai';
import * as fs from 'fs';

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
      style: 'vivid',
    });

    if (!images.data) {
      return Promise.resolve([]);
    }

    return Promise.resolve(images.data.map((image) => image.url));
  }

  async editImage(
    prompt: string,
    imagePath: string,
    numberOfImages: number,
  ): Promise<string[]> {
    const images = await this.openai.images.edit({
      image: fs.createReadStream(imagePath),
      prompt: prompt,
      n: numberOfImages,
    });

    if (!images.data) {
      return Promise.resolve([]);
    }

    return Promise.resolve(images.data.map((image) => image.url));
  }
}
