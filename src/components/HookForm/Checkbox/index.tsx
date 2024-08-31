import clsx from "clsx";
import styles from "./Checkbox.module.scss";
import { InputHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  type?: "checkbox";
  register: UseFormRegisterReturn;
}

function Checkbox(props: IProps) {
  const { type = "checkbox", register, ...rest } = props;

  return (
    <div className={clsx(styles.wrapper)}>
      <span className={clsx(styles.checkbox)}>
        <input type={type} {...rest} {...register} />
        <svg>
          <use xlinkHref="#checkbox" className={clsx(styles.checkbox)}></use>
        </svg>
      </span>
      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
        <symbol id="checkbox" viewBox="0 0 22 22">
          <path
            fill="none"
            stroke="#27AE60"
            d="M5.5,11.3L9,14.8L20.2,3.3l0,0c-0.5-1-1.5-1.8-2.7-1.8h-13c-1.7,0-3,1.3-3,3v13c0,1.7,1.3,3,3,3h13 c1.7,0,3-1.3,3-3v-13c0-0.4-0.1-0.8-0.3-1.2"
          />
        </symbol>
      </svg>
    </div>
  );
}

export default Checkbox;
