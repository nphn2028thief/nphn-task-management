import clsx from "clsx";

import styles from "./PageTitle.module.scss";

interface IProps {
  title: string;
}

function PageTitle(props: IProps) {
  const { title } = props;

  return (
    <div className={clsx(styles.wrapper)}>
      <h1>{title}</h1>
    </div>
  );
}

export default PageTitle;
