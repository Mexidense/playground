import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { VisionClient } from '@playground/shared/open-ai/vision.client';
import { VisionHttpClient } from '@playground/shared/open-ai/vision.http-client';
import { GenerateDocumentationService } from '@playground/sequence-diagram/generate-documentation.service';
import { FileToStringTransformer } from '@playground/shared/transformer/file/file-to-string.transformer';

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
      provide: VisionHttpClient,
      useFactory: (openAi: OpenAI) => new VisionHttpClient(openAi),
      inject: [OpenAI],
    },
    {
      provide: FileToStringTransformer,
      useClass: FileToStringTransformer,
    },
    {
      provide: GenerateDocumentationService,
      useFactory: (
        visionClient: VisionClient,
        fileToStringTransformer: FileToStringTransformer,
      ) =>
        new GenerateDocumentationService(visionClient, fileToStringTransformer),
      inject: [VisionHttpClient, FileToStringTransformer],
    },
  ],
})
export class SequenceDiagramGenerateDocumentationModule
  implements OnApplicationBootstrap
{
  constructor(
    private generateDocumentationService: GenerateDocumentationService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const whoAreYouInstruction = `You are the best architecture software engineer who has knowledge between services that share information for users and allow register and authorize users. Given a sequence diagram image, transcript it creating an introduction and list all user cases.\n`;
    const visionInstruction =
      'I provide you with a sequence diagram in PNG/JPG file format.\n';
    const mainInstruction = `Here my sequence diagram, create a introduction with this use case. It's only one use case. This use case must have a title, description, precondition, exceptions and the main scenario with the all flow of detailed events. Recheck, fix and detect all services involved. \n`;
    const outputInstruction = `Do not explain anything just generate all documentation using a Markdown format.\n`;

    const prompt = `${whoAreYouInstruction}${visionInstruction}${mainInstruction}${outputInstruction}`;

    const imageName = 'register_sec_diagram';
    const imageFormat = 'jpg';

    console.table(`🧪 ${prompt}`);
    console.log(`🧠 Understanding your sequence diagram...`);

    await this.generateDocumentationService.generateDocumentation(
      prompt,
      imageName,
      imageFormat,
    );
  }
}
