export type RunResponseType = {
  runId: string;
  treadId: string;
  createdAt: Date;
  completedAt: Date | null;
};

export interface ThreadClient {
  run(
    assistantId: string,
    messages: string[],
    fileIds: string[],
  ): Promise<RunResponseType>;

  startThreadStatusCheck(
    runId: string,
    threadId: string,
    intervalSeconds: number,
  ): Promise<void>;
}
