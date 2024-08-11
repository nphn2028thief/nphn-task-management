"use client";

import { ReactNode, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Portal from "../Portal";
import { AppContext } from "@/providers/AppProvider";
import { TaskContext } from "@/providers/TaskProvider";

interface IProps {
  isOpenPanel: boolean;
  children: ReactNode;
}

function Panel(props: IProps) {
  const { isOpenPanel, children } = props;

  const { setIsOpenPanel } = useContext(AppContext);
  const { setTask } = useContext(TaskContext);

  const handleClosePanel = () => {
    setIsOpenPanel(false);
    setTask(null);
  };

  const handleRenderChildren = () => {
    if (isOpenPanel) {
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

export default Panel;
