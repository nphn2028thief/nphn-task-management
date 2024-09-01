import { ITask } from "@/types/task";
import { EPath } from "./path";

// Render tasks depend on pathname
export const filterMap: Record<string, (task: ITask) => boolean> = {
  [EPath.IMPORTANT]: (task) => task.isImportant,
  [EPath.COMPLETED]: (task) => task.isCompleted,
  [EPath.INCOMPLETE]: (task) => !task.isCompleted,
};
