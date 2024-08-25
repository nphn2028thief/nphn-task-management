import { ReactNode } from "react";

interface IProps {
  isTrue: boolean;
  children: ReactNode;
}

function RenderIf(props: IProps) {
  const { isTrue, children } = props;

  return isTrue ? children : null;
}

export default RenderIf;
