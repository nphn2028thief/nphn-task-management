import { ReactNode } from "react";
import { AnimatePresence } from "framer-motion";

interface IProps {
  isTrue: boolean;
  children: ReactNode;
}

function RenderIf(props: IProps) {
  const { isTrue, children } = props;

  return <AnimatePresence>{isTrue ? children : null}</AnimatePresence>;
}

export default RenderIf;
