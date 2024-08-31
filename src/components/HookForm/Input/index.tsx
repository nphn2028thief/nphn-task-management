import { InputHTMLAttributes } from "react";
import { FieldErrors, UseFormRegisterReturn } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import clsx from "clsx";

import styles from "./Input.module.scss";
import RenderIf from "@/components/RenderIf";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  register: UseFormRegisterReturn;
  wrapperClassName?: string;
  errorMessage?: string;
  name: string;
}

function Input(props: IProps) {
  const {
    label,
    register,
    wrapperClassName,
    errorMessage,
    name,
    id,
    className,
    ...rest
  } = props;

  return (
    <div className={clsx(styles["wrapper"], wrapperClassName)}>
      <label htmlFor={id} className="text-sm">
        {label}
      </label>
      <input
        type="text"
        id={id}
        spellCheck={false}
        {...rest}
        className={`placeholder:text-sm ${className} ${
          errorMessage && clsx(styles.error)
        }`}
        {...register}
      />
      <RenderIf isTrue={!!errorMessage}>
        <p style={{ color: "var(--error-color)" }} className="text-xs">
          {errorMessage}
        </p>
      </RenderIf>
    </div>
  );
}

export default Input;
