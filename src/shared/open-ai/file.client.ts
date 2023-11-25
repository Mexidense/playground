export interface FileClient {
  get(fileId: string): Promise<string>;
}
