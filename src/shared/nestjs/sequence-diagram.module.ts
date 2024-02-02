import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { GenerateCodeService } from '@playground/sequence-diagram/generate-code.service';
import { VisionClient } from '@playground/shared/open-ai/vision.client';
import { VisionHttpClient } from '@playground/shared/open-ai/vision.http-client';

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
      provide: GenerateCodeService,
      useFactory: (visionClient: VisionClient) =>
        new GenerateCodeService(visionClient),
      inject: [VisionHttpClient],
    },
  ],
})
export class SequenceDiagramModule implements OnApplicationBootstrap {
  constructor(private sequenceDiagramService: GenerateCodeService) {}

  async onApplicationBootstrap(): Promise<void> {
    const programmingLanguage = 'typescript';
    const architectures = ['Domain Driven-Design', 'Hexagonal'];
    const shouldHasTests = true;
    const framework = 'NextJS';

    const whoAreYouInstruction = `You are the best architecture software engineer who has knowledge in ${architectures.join(
      ',',
    )} architectures.\n`;
    const visionInstruction =
      'I provide you with a sequence diagram in PNG/JPG file format.\n';
    const mainInstruction = `You should provide a ${programmingLanguage} example with all code generated watching this sequence diagram using ${architectures.join(
      ',',
    )} architectures taking into account all principles in this or these architecture/s.\n`;
    const outputInstruction = `Do not explain anything just generate all within ONLY one ${programmingLanguage} code block in Markdown format.\n`;

    let prompt = `${whoAreYouInstruction}${visionInstruction}${mainInstruction}${outputInstruction}`;
    if (shouldHasTests) {
      prompt += `Also, include test.\n`;
    }
    if (framework) {
      prompt += `Also, follows the rules of this framework: ${framework}.`;
    }

    const urlImage =
      'http://www.effexis.com/sde/images/AutomatedRegistrationSystemSmall1.png';

    console.table(`🧪 ${prompt}`);
    console.log(`🧠 Understanding your sequence diagram...`);
    await this.sequenceDiagramService.generateCode(
      programmingLanguage,
      prompt,
      urlImage,
    );
  }
}
