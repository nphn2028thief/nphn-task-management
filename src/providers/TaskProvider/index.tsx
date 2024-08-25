"use client";

import { createContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";

import { CATCH_ERROR_MESSAGE } from "@/constants";
import { EAPI_URL } from "@/constants/path";
import { IResponse } from "@/types/api";
import { ITask } from "@/types/task";
import { IChildrenProps } from "@/types/children";

interface TaskContextType {
  task: ITask | null;
  tasks: ITask[];
  isLoadingTask: boolean;
  setTask: (task: ITask | null) => void;
  setTasks: (tasks: ITask[]) => void;
  setIsLoadingTask: (isLoadingTask: boolean) => void;
}

const TaskContext = createContext<TaskContextType>({
  task: null,
  tasks: [],
  isLoadingTask: true,
  setTask: () => {},
  setTasks: () => {},
  setIsLoadingTask: () => {},
});

function TaskProvider({ children }: IChildrenProps) {
  const [task, setTask] = useState<ITask | null>(null);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isLoadingTask, setIsLoadingTask] = useState<boolean>(false);

  const { user } = useUser();

  useEffect(() => {
    setIsLoadingTask(true);

    const getAllTasks = async () => {
      try {
        const { data } = await axios.get<IResponse<ITask[]>>(EAPI_URL.TASKS);

        if (data.errorMessage) {
          toast.error(data.errorMessage);
          return;
        }

        setTasks(data.data);
      } catch (error) {
        toast.error(CATCH_ERROR_MESSAGE);
      } finally {
        setIsLoadingTask(false);
      }
    };

    user && getAllTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TaskContext.Provider
      value={{
        task,
        tasks,
        isLoadingTask,
        setTask,
        setTasks,
        setIsLoadingTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export { TaskContext, TaskProvider };
