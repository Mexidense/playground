import { ImageClient } from '@playground/shared/infrastructure/open-ai/image.client';

export class ImageGenerationFromImageService {
  constructor(private readonly imageGenerationClient: ImageClient) {}

  async editImage(
    prompt: string,
    imagePath: string,
    numberOfImages: number,
  ): Promise<void> {
    try {
      const images = await this.imageGenerationClient.editImage(
        prompt,
        imagePath,
        numberOfImages,
      );

      images.map((image) => console.log(`🎇 ${image}`));
    } catch (error) {
      console.log('❌ Something wrong generating image', error);
    }
  }
}
