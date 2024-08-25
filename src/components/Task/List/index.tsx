"use client";

import { usePathname } from "next/navigation";
import { useContext } from "react";
import clsx from "clsx";

import TaskItem from "../Item";
import RenderIf from "@/components/RenderIf";
import { TaskContext } from "@/providers/TaskProvider";
import { AppContext } from "@/providers/AppProvider";
import { plus } from "@/constants/icons";
import { filterMap } from "@/constants/task";
import useTheme from "@/hooks/useTheme";
import { ITask } from "@/types/task";

import styles from "./TaskList.module.scss";

function TaskList() {
  const pathname = usePathname();

  const { tasks, isLoadingTask } = useContext(TaskContext);
  const { setIsOpenPanel } = useContext(AppContext);

  const { theme } = useTheme((state) => state);

  const handleRenderTasks = () => {
    let adjustedTasks: ITask[] = [];

    const pathKey = Object.keys(filterMap).find((key) =>
      pathname.includes(key)
    );

    adjustedTasks = pathKey // pathKey maybe undefined (HOME: "/")
      ? [...tasks.filter(filterMap[pathKey])]
      : [...tasks];

    if (isLoadingTask) {
      return Array.from({ length: 6 }, (_, index) => (
        <div key={index} className={clsx(styles.skeleton)}></div>
      ));
    }

    return adjustedTasks.map((item) => <TaskItem key={item.id} data={item} />);
  };

  return (
    <div className={clsx(styles.wrapper)}>
      <div className={clsx(styles["task-list"])}>
        {handleRenderTasks()}
        <RenderIf isTrue={!isLoadingTask}>
          <button
            style={{
              color: theme.colorGrey2,
              borderColor: theme.colorGrey5,
            }}
            className={clsx(styles["create-task-btn"])}
            onClick={() => setIsOpenPanel(true)}
          >
            <i className={plus}></i>
            add new task
          </button>
        </RenderIf>
      </div>
    </div>
  );
}

export default TaskList;
