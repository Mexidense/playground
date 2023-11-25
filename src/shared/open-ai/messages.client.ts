export type ThreadMessageResponse = {
  id: string;
  type: string;
  value: string;
};

export interface MessagesClient {
  get(threadId: string): Promise<ThreadMessageResponse[]>;
}
