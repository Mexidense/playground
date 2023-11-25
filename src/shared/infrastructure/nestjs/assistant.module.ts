import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { RunThreadService } from '@playground/assistant/application/service/run-thread.service';
import { ThreadClient } from '@playground/shared/infrastructure/open-ai/thread.client';
import { GetThreadMessagesService } from '@playground/assistant/application/service/get-thread-messages.service';
import { MessagesClient } from '@playground/shared/infrastructure/open-ai/messages.client';
import { FileClient } from '@playground/shared/infrastructure/open-ai/file.client';
import { ThreadHttpClient } from '@playground/shared/infrastructure/open-ai/thread.http-client';
import { MessagesHttpClient } from '@playground/shared/infrastructure/open-ai/messages.http-client';
import { FileHttpClient } from '@playground/shared/infrastructure/open-ai/file.http-client';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [],
  providers: [
    {
      provide: OpenAI,
      useFactory: (configService: ConfigService) =>
        new OpenAI({
          apiKey: configService.get<string>('OPENAI_API_KEY'),
        }),
      inject: [ConfigService],
    },
    {
      provide: ThreadHttpClient,
      useFactory: (openai: OpenAI) => new ThreadHttpClient(openai),
      inject: [OpenAI],
    },
    {
      provide: MessagesHttpClient,
      useFactory: (openai: OpenAI) => new MessagesHttpClient(openai),
      inject: [OpenAI],
    },
    {
      provide: FileHttpClient,
      useFactory: (openai: OpenAI) => new FileHttpClient(openai),
      inject: [OpenAI],
    },
    {
      provide: RunThreadService,
      useFactory: (threadClient: ThreadClient) =>
        new RunThreadService(threadClient),
      inject: [ThreadHttpClient],
    },
    {
      provide: GetThreadMessagesService,
      useFactory: (
        threadMessagesClient: MessagesClient,
        fileClient: FileClient,
      ) => new GetThreadMessagesService(threadMessagesClient, fileClient),
      inject: [MessagesHttpClient, FileHttpClient],
    },
  ],
})
export class AssistantModule implements OnApplicationBootstrap {
  constructor(
    private runThreadService: RunThreadService,
    private getThreadMessagesService: GetThreadMessagesService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const assistantId = 'asst_H183QAsV984HCb4chMZjLqBh';
    const messages = [
      'Search-providing learning language trends to productivity',
      'Generate a PNG diagram image about what is the high and low productivity performance using their date time range trends across different languages.',
    ];
    const files = ['file-eixMw18V7ZtTwzbOvMgT2Owz'];

    const runId = await this.runThreadService.run(
      assistantId,
      messages,
      files,
      1,
    );

    const response = await this.getThreadMessagesService.get(runId);
    for (const message of response) {
      console.log(message);
    }
  }
}
