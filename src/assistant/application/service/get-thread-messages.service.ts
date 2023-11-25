import { MessagesClient } from '@playground/shared/infrastructure/open-ai/messages.client';
import { FileClient } from '@playground/shared/infrastructure/open-ai/file.client';

export class GetThreadMessagesService {
  constructor(
    private readonly threadMessagesClient: MessagesClient,
    private readonly fileClient: FileClient,
  ) {}

  async get(threadId: string): Promise<string[]> {
    const result = [];
    const messages = await this.threadMessagesClient.get(threadId);

    for (const message of messages) {
      if (message.type === 'text') {
        result.push(`📝 ${message.value}`);

        continue;
      }

      if (message.type === 'image_file') {
        const fileId = message.value;
        console.log(`⏳ Downloading file: ${fileId}...`);

        const filepath = await this.fileClient.getAndStore(fileId);
        if (filepath) {
          result.push(`📊 File stored: ${filepath}`);
        }
      }
    }

    return result;
  }
}
