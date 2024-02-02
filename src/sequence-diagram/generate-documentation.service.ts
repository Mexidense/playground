import { VisionClient } from '@playground/shared/open-ai/vision.client';
import { FileToStringTransformer } from '@playground/shared/transformer/file/file-to-string.transformer';
import * as fs from 'fs';

export class GenerateDocumentationService {
  constructor(
    private readonly visionClient: VisionClient,
    private readonly fileToStringTransformer: FileToStringTransformer,
  ) {}

  async generateDocumentation(
    prompt: string,
    imageName: string,
    format: string,
  ): Promise<void> {
    const imageEncoded = await this.fileToStringTransformer.transform(
      imageName,
      format,
    );
    const result = await this.visionClient.understandImage(
      prompt,
      imageEncoded,
    );
    if (!result) {
      console.log(`😅 I didn't understand your sequence diagram`);
    }

    console.log(`📝 Documentation: \n${result}`);

    const filePath = `files/${imageName}_documentation.md`;
    fs.writeFileSync(filePath, result);

    console.log(`📝 Documentation generated here: ${filePath}`);
  }
}
