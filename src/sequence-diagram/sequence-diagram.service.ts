import * as fs from 'fs';
import { VisionClient } from '@playground/shared/open-ai/vision.client';

export class SequenceDiagramService {
  constructor(private readonly visionClient: VisionClient) {}

  async generateCode(
    programmingLanguage: string,
    prompt: string,
    urlImage: string,
  ): Promise<void> {
    const result = await this.visionClient.understandImage(prompt, urlImage);
    if (!result) {
      console.log(`😅 I didn't understand your sequence diagram`);
    }

    const codeBlock = this.extractTypescriptCode(result, programmingLanguage);
    if (!codeBlock) {
      console.log(`😅 Sorry, I couldn't generate the code`);
    }

    const filePath = `files/${programmingLanguage}_code.md`;
    const fileContent = `\`\`\`${programmingLanguage}\n${codeBlock}\n\`\`\``;
    fs.writeFileSync(filePath, fileContent);

    console.log(`📝 Code generated here: ${filePath}`);
  }

  private extractTypescriptCode(
    markdownString: string,
    programmingLanguage: string,
  ): string | null {
    // Define a regular expression to match TypeScript code blocks in Markdown
    const codeBlockRegex = new RegExp(
      '```' + programmingLanguage + '([\\s\\S]*?)```',
    );

    // Use the regular expression to find matches in the input string
    const match = markdownString.match(codeBlockRegex);

    // If a match is found, return the TypeScript code, otherwise return null
    return match ? match[1].trim() : null;
  }
}
