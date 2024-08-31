"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import clsx from "clsx";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import Modal from "@/components/Modal";
import RenderIf from "@/components/RenderIf";
import { Checkbox } from "@/components/HookForm";
import { CATCH_ERROR_MESSAGE } from "@/constants";
import { EAPI_URL } from "@/constants/path";
import { edit, plus } from "@/constants/icons";
import { AppContext } from "@/providers/AppProvider";
import { TaskContext } from "@/providers/TaskProvider";
import { IResponse } from "@/types/api";
import { ITask, ITaskRequest } from "@/types/task";

import styles from "./TaskModal.module.scss";
import Input from "@/components/HookForm/Input";
import Textarea from "@/components/HookForm/Textarea";

const Schema = Yup.object({
  title: Yup.string().required("Title is required."),
  description: Yup.string().optional(),
  date: Yup.string().required("Date is required."),
  isCompleted: Yup.boolean().optional(),
  isImportant: Yup.boolean().optional(),
});

function TaskPanel() {
  const [taskId, setTaskId] = useState<string | null>(null);

  const { isOpenModal, setIsOpenModal, setIsLoading } = useContext(AppContext);
  const { task, tasks, setTask, setTasks } = useContext(TaskContext);

  const defaultValues = useMemo<ITaskRequest>(() => {
    const data: ITaskRequest = {
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

  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<ITaskRequest>({
    defaultValues,
    resolver: yupResolver(Schema),
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

  const onSubmit = async (data: ITaskRequest) => {
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
            <Input
              label="Title"
              register={register("title")}
              wrapperClassName={clsx(styles["form-control"])}
              errorMessage={errors.title?.message}
              name="title"
              id="title"
              placeholder="E.g. Learn Chinese"
            />
            <Textarea
              label="Description (Optional)"
              register={register("description")}
              wrapperClassName={clsx(styles["form-control"])}
              id="description"
              placeholder="E.g. Go to SuperChinese app to start learning"
            />
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
                <Checkbox id="isCompleted" register={register("isCompleted")} />
                <label htmlFor="isCompleted">Complete</label>
              </div>
            </RenderIf>
            <div className={clsx(styles["form-control-toggle"])}>
              <Checkbox id="isImportant" register={register("isImportant")} />
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
