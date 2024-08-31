"use client";

import { ReactNode, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Portal from "../Portal";
import { AppContext } from "@/providers/AppProvider";
import { TaskContext } from "@/providers/TaskProvider";

interface IProps {
  isOpen: boolean;
  children: ReactNode;
}

function Modal(props: IProps) {
  const { isOpen, children } = props;

  const { setIsOpenModal } = useContext(AppContext);
  const { setTask } = useContext(TaskContext);

  const handleClosePanel = () => {
    setIsOpenModal(false);
    setTask(null);
  };

  const handleRenderChildren = () => {
    if (isOpen) {
      return (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 z-[99]"
            onClick={handleClosePanel}
          ></motion.div>
          {children}
        </>
      );
    }

    return null;
  };

  return (
    <Portal>
      <AnimatePresence>{handleRenderChildren()}</AnimatePresence>
    </Portal>
  );
}

export default Modal;
