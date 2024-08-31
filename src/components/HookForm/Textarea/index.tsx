import clsx from "clsx";
import styles from "./Textarea.module.scss";
import { TextareaHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface IProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  register: UseFormRegisterReturn;
  wrapperClassName?: string;
}

function Textarea(props: IProps) {
  const { label, register, wrapperClassName, id, rows, className, ...rest } =
    props;

  return (
    <div className={clsx(styles["wrapper"], wrapperClassName)}>
      <label htmlFor={id} className="text-sm">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows ?? 4}
        spellCheck={false}
        {...rest}
        className={`placeholder:text-sm ${className}`}
        {...register}
      />
    </div>
  );
}

export default Textarea;
