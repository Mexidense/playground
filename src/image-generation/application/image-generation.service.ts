import { ImageClient } from '@playground/shared/infrastructure/open-ai/image.client';

export class ImageGenerationService {
  constructor(private readonly imageGenerationClient: ImageClient) {}

  async generate(prompt: string, numberOfImages: number): Promise<void> {
    try {
      const images = await this.imageGenerationClient.generateImages(
        prompt,
        numberOfImages,
      );

      images.map((image) => console.log(`🎇 ${image}`));
    } catch (error) {
      console.log('❌ Something wrong generating image', error);
    }
  }
}
