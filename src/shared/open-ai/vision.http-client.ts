import { VisionClient } from '@playground/shared/open-ai/vision.client';
import OpenAI from 'openai';

export class VisionHttpClient implements VisionClient {
  constructor(private readonly openai: OpenAI) {}

  async understandImage(
    prompt: string,
    urlImage: string,
  ): Promise<string | null> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: urlImage,
                },
              },
            ],
          },
        ],
        max_tokens: 2000,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error(`❌ Error understanding image`, error);

      return null;
    }
  }
}
