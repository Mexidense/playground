export interface ImageClient {
  generateImages(prompt: string, numberOfImages: number): Promise<string[]>;

  editImage(
    prompt: string,
    imagePath: string,
    numberOfImages: number,
  ): Promise<string[]>;
}
