export interface VisionClient {
  understandImage(prompt: string, urlImage: string): Promise<string | null>;
}
