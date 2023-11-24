import {
  MessagesClient,
  ThreadMessageResponse,
} from '@playground/assistant/infrastructure/open-ai/messages.client';
import OpenAI from 'openai';

export class MessagesHttpClient implements MessagesClient {
  constructor(private readonly openai: OpenAI) {}

  async get(threadId: string): Promise<ThreadMessageResponse[]> {
    console.info(`⏳ Getting messages...`);

    try {
      const result = [];
      const messages = await this.openai.beta.threads.messages.list(threadId);

      for (const message of messages.data) {
        const messageRaw = message.content[0];
        if (messageRaw.type === 'text') {
          result.push({ type: messageRaw.type, value: messageRaw.text.value });
        }

        if (messageRaw.type === 'image_file') {
          result.push({
            type: messageRaw.type,
            value: messageRaw.image_file.file_id,
          });
        }
      }

      return Promise.resolve(result);
    } catch (error) {
      console.error('❌ Something wrong getting and storing file', error);
    }
  }
}
