import { ThreadClient } from '@playground/shared/open-ai/thread.client';

export class RunThreadService {
  constructor(private readonly threadClient: ThreadClient) {}

  async run(
    assistantId: string,
    messages: string[] = [],
    fileIds: string[] = [],
    intervalSeconds: number = 1,
  ): Promise<string> {
    const run = await this.threadClient.run(assistantId, messages, fileIds);

    await this.threadClient.startThreadStatusCheck(
      run.runId,
      run.treadId,
      intervalSeconds,
    );

    return Promise.resolve(run.treadId);
  }
}
