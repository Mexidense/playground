import {
  RunResponseType,
  ThreadClient,
} from '@playground/shared/infrastructure/open-ai/thread.client';
import OpenAI from 'openai';
import { ThreadCreateAndRunParams } from 'openai/resources/beta';
import Message = ThreadCreateAndRunParams.Thread.Message;

export class ThreadHttpClient implements ThreadClient {
  constructor(
    private readonly openai: OpenAI,
    private lastStatus: string = '',
    private isChecking: boolean = false,
  ) {}

  async run(
    assistantId: string,
    messages: string[],
    fileIds: string[],
  ): Promise<RunResponseType> {
    const formattedFiles: Message[] = fileIds.map((fileId) => {
      return {
        role: 'user',
        content: 'Read and process this file',
        file_ids: [fileId],
      };
    });

    const formattedMessages: Message[] = messages.map((message) => {
      return {
        role: 'user',
        content: message,
      };
    });

    try {
      const run = await this.openai.beta.threads.createAndRun({
        assistant_id: assistantId,
        thread: {
          messages: [...formattedFiles, ...formattedMessages],
        },
      });

      console.info(`🧠 Thread ${run.thread_id} created`);

      return {
        runId: run.id,
        treadId: run.thread_id,
        createdAt: new Date(run.created_at * 1000),
        completedAt: new Date(run.completed_at * 1000),
      };
    } catch (error) {
      console.log('❌ Error creating and running thread', error);
    }
  }

  async startThreadStatusCheck(
    runId: string,
    threadId: string,
    intervalSeconds: number,
  ): Promise<void> {
    this.isChecking = true;

    while (this.isChecking) {
      try {
        const run = await this.openai.beta.threads.runs.retrieve(
          threadId,
          runId,
        );

        console.info(`⏳ Thread ${run.status}...`);

        if (run.status === 'completed') {
          console.info(`✅ Thread ${run.status}...`);
          this.isChecking = false;

          return Promise.resolve();
        }

        if (run.status !== this.lastStatus) {
          this.lastStatus = run.status;

          await new Promise((resolve) =>
            setTimeout(resolve, intervalSeconds * 10000),
          );
        }
      } catch (error) {
        console.error('❌ Error checking job status', error);
      }
    }
  }
}
