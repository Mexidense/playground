export interface FileClient {
  getAndStore(fileId: string): Promise<string>;
}
