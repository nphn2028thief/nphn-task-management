"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import clsx from "clsx";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import Panel from "..";
import { CATCH_ERROR_MESSAGE } from "@/constants";
import { EAPI_URL } from "@/constants/path";
import { AppContext } from "@/providers/AppProvider";
import { TaskContext } from "@/providers/TaskProvider";
import { IResponse } from "@/types/api";
import { ITask } from "@/types/task";

import styles from "./TaskPanel.module.scss";

const Schema = z
  .object({
    title: z.string(),
    description: z.string().optional(),
    date: z.string(),
    isImportant: z.boolean(),
  })
  .required({
    title: true,
    date: true,
    isImportant: true,
  });

type TSchema = z.infer<typeof Schema>;

function TaskPanel() {
  const [taskId, setTaskId] = useState<string | null>(null);

  const { isOpenPanel, setIsOpenPanel, setIsLoading } = useContext(AppContext);
  const { task, tasks, setTask, setTasks } = useContext(TaskContext);

  const defaultValues = useMemo<TSchema>(() => {
    const data: TSchema = {
      title: "",
      description: "",
      date: "",
      isImportant: false,
    };

    if (task) {
      data.title = task.title;
      data.description = task.description;
      data.date = task.date;
      data.isImportant = task.isImportant;

      setTaskId(task.id);
    }

    return data;
  }, [task]);

  const { register, reset, handleSubmit } = useForm<TSchema>({
    defaultValues,
    resolver: zodResolver(Schema),
  });

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenPanel]);

  const handleClosePanel = () => {
    setIsOpenPanel(false);
    setTask(null);
    setTaskId(null);
  };

  const onSubmit = async (data: TSchema) => {
    setIsLoading(true);

    try {
      // Case edit
      if (task && taskId) {
        const { data: responseData } = await axios.patch<IResponse<ITask[]>>(
          `${EAPI_URL.TASKS}/${taskId}`,
          data
        );

        if (responseData.errorMessage) {
          toast.error(responseData.errorMessage);
          return;
        }

        setTasks(
          tasks.map((item) =>
            item.id === taskId ? { ...item, ...responseData.data[0] } : item
          )
        );
        toast.success("Edit task successfully!");
        return;
      }

      // Case create
      const { data: responseData } = await axios.post<IResponse<ITask[]>>(
        EAPI_URL.TASKS,
        data
      );

      if (responseData.errorMessage) {
        toast.error(responseData.errorMessage);
        return;
      }

      setTasks([...tasks, { ...responseData.data[0] }]);
      toast.success("Create new task successfully!");
    } catch (error) {
      toast.error(CATCH_ERROR_MESSAGE);
    } finally {
      setIsOpenPanel(false);
      setIsLoading(false);
    }
  };

  return (
    <Panel isOpenPanel={isOpenPanel}>
      <motion.div
        initial={{ translateX: "100%" }}
        animate={{ translateX: 0 }}
        exit={{ translateX: "100%" }}
        transition={{ duration: 0.2 }}
        className={clsx(styles.wrapper)}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>{task ? "Edit" : "Create"} task</h1>

          <div className={clsx(styles["form-container"])}>
            <div className={clsx(styles["form-control"])}>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                placeholder="E.g: Learn Chinese"
                {...register("title")}
              />
            </div>
            <div className={clsx(styles["form-control"])}>
              <label htmlFor="description">Description</label>
              <textarea id="description" {...register("description")} />
            </div>
            <div className={clsx(styles["form-control"])}>
              <label htmlFor="date">Date</label>
              <input type="date" {...register("date")} />
            </div>
            <div className={clsx(styles["form-control"])}>
              <label htmlFor="isImportant">Important</label>
              <input
                type="checkbox"
                id="isImportant"
                {...register("isImportant")}
              />
            </div>
          </div>

          <div className={clsx(styles.buttons)}>
            <button type="button" onClick={handleClosePanel}>
              Cancel
            </button>
            <button type="submit" className="bg-purple-600 text-white">
              {task ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </Panel>
  );
}

export default TaskPanel;
