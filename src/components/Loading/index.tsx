import clsx from "clsx";

import styles from "./Loading.module.scss";

interface IProps {
  position?: "absolute" | "fixed";
  className?: string;
}

function Loading(props: IProps) {
  const { position = "absolute", className } = props;

  return (
    <div
      className={`${position} left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[99999] ${className}`}
    >
      <span className={clsx(styles.loader)}></span>
    </div>
  );
}

export default Loading;
