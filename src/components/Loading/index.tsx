import clsx from "clsx";

import styles from "./Loading.module.scss";

interface IProps {
  position?: "absolute" | "fixed";
  noTransform?: boolean;
  className?: string;
  zIndex: number;
}

function Loading(props: IProps) {
  const {
    position = "absolute",
    noTransform = false,
    className,
    zIndex,
  } = props;

  return (
    <div
      style={{ zIndex }}
      className={`flex ${position} left-1/2 top-1/2 ${
        !noTransform && "-translate-x-1/2 -translate-y-1/2"
      }`}
    >
      <span className={clsx(styles.loader, className)}></span>
    </div>
  );
}

export default Loading;
