import * as fs from 'fs';

export class FileToStringTransformer {
  DEFAULT_PATH = 'files';

  async transform(filename: string, format: string): Promise<string> {
    const buffer = fs.readFileSync(
      `${this.DEFAULT_PATH}/${filename}.${format}`,
    );

    const imageInString = Buffer.from(buffer).toString('base64');

    return `data:image/${format};base64,${imageInString}`;
  }
}
