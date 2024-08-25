"use client";

import { useContext } from "react";
import clsx from "clsx";
import axios from "axios";
import toast from "react-hot-toast";

import RenderIf from "@/components/RenderIf";
import { TaskContext } from "@/providers/TaskProvider";
import { AppContext } from "@/providers/AppProvider";
import { edit, trash } from "@/constants/icons";
import { EAPI_URL } from "@/constants/path";
import { CATCH_ERROR_MESSAGE } from "@/constants";
import useTheme from "@/hooks/useTheme";
import { IResponse } from "@/types/api";
import { ITask } from "@/types/task";
import { formatDate } from "@/lib/utils";

import styles from "../List/TaskList.module.scss";

interface IProps {
  data: ITask;
}

function TaskItem(props: IProps) {
  const { data } = props;

  const { setIsOpenPanel, setIsLoading } = useContext(AppContext);
  const { tasks, setTask, setTasks } = useContext(TaskContext);

  const { theme } = useTheme((state) => state);

  const handleEditTask = (task: ITask) => {
    setIsOpenPanel(true);
    setTask(task);
  };

  const handleDeleteTask = async (taskId: string) => {
    setIsLoading(true);

    try {
      const { data } = await axios.delete<IResponse<ITask>>(
        `${EAPI_URL.TASKS}/${taskId}`
      );

      if (data.errorMessage) {
        toast.error(data.errorMessage);
        return;
      }

      setTasks(tasks.filter((item) => item.id !== taskId));
      toast.success("Delete task successfully!");
    } catch (error) {
      toast.error(CATCH_ERROR_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      key={data.id}
      style={{ borderColor: theme.borderColor2 }}
      className={clsx(styles["task-item"])}
    >
      <div className="flex-1 flex flex-col gap-1">
        <h2>{data.title}</h2>
        <p className="flex-1 text-sm line-clamp-3">{data.description}</p>
        <p className="text-sm">{formatDate(data.date)}</p>
      </div>
      <div className="flex justify-between items-center">
        {/* Status */}
        <div className="flex gap-2 items-center text-sm">
          {data.isCompleted ? (
            <span
              style={{ backgroundColor: theme.colorGreenDark }}
              className={clsx(styles.status)}
            >
              completed
            </span>
          ) : (
            <span
              style={{ backgroundColor: theme.colorDanger }}
              className={clsx(styles.status)}
            >
              incompleted
            </span>
          )}
          <RenderIf isTrue={data.isImportant}>
            <p
              style={{ backgroundColor: theme.colorDanger }}
              className={clsx(styles.status)}
            >
              important
            </p>
          </RenderIf>
        </div>

        {/* Action buttons */}
        <div className={clsx(styles["action-buttons"])}>
          <button onClick={() => handleEditTask(data)}>
            <i className={edit}></i>
          </button>
          <button onClick={() => handleDeleteTask(data.id)}>
            <i className={trash}></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskItem;
