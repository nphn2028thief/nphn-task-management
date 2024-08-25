"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import clsx from "clsx";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import Modal from "@/components/modal";
import RenderIf from "@/components/RenderIf";
import { CATCH_ERROR_MESSAGE } from "@/constants";
import { EAPI_URL } from "@/constants/path";
import { edit, plus } from "@/constants/icons";
import { AppContext } from "@/providers/AppProvider";
import { TaskContext } from "@/providers/TaskProvider";
import { IResponse } from "@/types/api";
import { ITask } from "@/types/task";

import styles from "./TaskModal.module.scss";

const Schema = z
  .object({
    title: z.string(),
    description: z.string().optional(),
    date: z.string(),
    isCompleted: z.boolean(),
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

  const { isOpenModal, setIsOpenModal, setIsLoading } = useContext(AppContext);
  const { task, tasks, setTask, setTasks } = useContext(TaskContext);

  const defaultValues = useMemo<TSchema>(() => {
    const data: TSchema = {
      title: "",
      description: "",
      date: "",
      isCompleted: false,
      isImportant: false,
    };

    if (task) {
      data.title = task.title;
      data.description = task.description;
      data.date = task.date;
      data.isCompleted = task.isCompleted;
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
  }, [isOpenModal]);

  const handleCloseModal = () => {
    setIsOpenModal(false);
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
      setIsOpenModal(false);
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpenModal}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={clsx(styles.wrapper)}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <h1>{task ? "Edit" : "Create a"} task</h1>
          </div>

          <div className={clsx(styles["form-container"])}>
            <div className={clsx(styles["form-control"])}>
              <label htmlFor="title" className="text-sm">
                Title
              </label>
              <input
                type="text"
                id="title"
                placeholder="E.g. Learn Chinese"
                spellCheck={false}
                className="placeholder:text-sm"
                {...register("title")}
              />
            </div>
            <div className={clsx(styles["form-control"])}>
              <label htmlFor="description" className="text-sm">
                Description
              </label>
              <textarea
                id="description"
                placeholder="E.g. Go to SuperChinese app to start learning"
                rows={4}
                spellCheck={false}
                className="placeholder:text-sm"
                {...register("description")}
              />
            </div>
            <div className={clsx(styles["form-control"])}>
              <label htmlFor="date" className="text-sm">
                Date
              </label>
              <input
                type="date"
                className="placeholder:text-sm"
                {...register("date")}
              />
            </div>
            <RenderIf isTrue={!!task}>
              <div className={clsx(styles["form-control-toggle"], "!-mb-2")}>
                <input
                  type="checkbox"
                  id="isCompleted"
                  {...register("isCompleted")}
                />
                <label htmlFor="isCompleted">Complete</label>
              </div>
            </RenderIf>
            <div className={clsx(styles["form-control-toggle"])}>
              <input
                type="checkbox"
                id="isImportant"
                {...register("isImportant")}
              />
              <label htmlFor="isImportant">Important</label>
            </div>
          </div>

          <div className={clsx(styles.buttons)}>
            <button type="button" onClick={handleCloseModal}>
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1 text-sm bg-[#27AE60] text-white"
            >
              <i className={task ? edit : plus}></i>
              {task ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </Modal>
  );
}

export default TaskPanel;
