export type TaskStatus = "todo" | "in-progress" | "done";

export interface ITask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: number;
}
