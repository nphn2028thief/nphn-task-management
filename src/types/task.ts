export interface ITask {
  id: string;
  title: string;
  description: string;
  date: string;
  isCompleted: boolean;
  isImportant: boolean;
}

export interface ITaskRequest {
  title: string;
  description?: string;
  date: string;
  isCompleted?: boolean;
  isImportant?: boolean;
}
