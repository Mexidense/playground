export interface ImageClient {
  generateImages(prompt: string, numberOfImages: number): Promise<string[]>;
}
