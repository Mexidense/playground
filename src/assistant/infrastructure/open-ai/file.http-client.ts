import OpenAI from 'openai';
import { FileClient } from '@playground/assistant/infrastructure/open-ai/file.client';
import * as fs from 'fs';

export class FileHttpClient implements FileClient {
  constructor(private readonly openai: OpenAI) {}

  async getAndStore(fileId: string): Promise<string | null> {
    try {
      const file = await this.openai.files.content(fileId);
      if (!file.ok) {
        return null;
      }

      const outputFileName = `./files/${fileId}.png`;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.createWriteStream(outputFileName).write(buffer);

      console.log(`✅ File downloaded (${outputFileName})...`);
      return Promise.resolve(outputFileName);
    } catch (error) {
      console.error('❌ Something wrong getting and storing file', error);
    }
  }
}
