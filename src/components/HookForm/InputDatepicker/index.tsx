"use client";

import {
  InputHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  FieldValues,
  Path,
  PathValue,
  UseFormRegisterReturn,
  UseFormSetValue,
} from "react-hook-form";
import dayjs from "dayjs";
import clsx from "clsx";

import Datepicker from "../Datepicker";
import RenderIf from "@/components/RenderIf";
import { formatDate } from "@/lib/utils";

import styles from "./InputDatepicker.module.scss";

interface IProps<T extends FieldValues>
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  register: UseFormRegisterReturn;
  value: string;
  setValue: UseFormSetValue<T>;
  wrapperClassName?: string;
  errorMessage?: string;
  name: Path<T>;
}

function InputDatepicker<T extends FieldValues>(props: IProps<T>) {
  const {
    label,
    register,
    value,
    setValue,
    wrapperClassName,
    errorMessage,
    name,
    id,
    className,
    ...rest
  } = props;

  const [showDatepicker, setShowDatepicker] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [position, setPosition] = useState<any>({ top: 0, right: 0 });

  useEffect(() => {
    const handlePosition = () => {
      if (inputRef.current) {
        const { x, height } = inputRef.current.getBoundingClientRect();
        setPosition({ top: `${height}px`, right: `${x}px` });
      }
    };

    handlePosition();

    window.addEventListener("resize", handlePosition);

    return () => {
      window.removeEventListener("resize", handlePosition);
    };
  }, []);

  const getDateValue = useCallback(
    (date: dayjs.Dayjs) => {
      setValue(
        name,
        formatDate(date.toDate().toLocaleDateString()) as PathValue<T, Path<T>>
      );
      setShowDatepicker(false);
    },
    [name, setValue]
  );

  return (
    <div className={clsx(styles["wrapper"], wrapperClassName)}>
      <label htmlFor={id} className="text-sm">
        {label}
      </label>
      <div className="relative">
        <input
          {...rest}
          {...register}
          ref={inputRef}
          value={value}
          type="text"
          id={id}
          readOnly
          className={`placeholder:text-sm ${className} ${
            errorMessage && clsx(styles.error)
          }`}
          onClick={() => setShowDatepicker(true)}
        />
        <RenderIf isTrue={showDatepicker}>
          <Datepicker
            position={position}
            value={value}
            setShowDatepicker={setShowDatepicker}
            onClick={getDateValue}
          />
        </RenderIf>
      </div>
      <RenderIf isTrue={!!errorMessage}>
        <p style={{ color: "var(--error-color)" }} className="text-xs">
          {errorMessage}
        </p>
      </RenderIf>
    </div>
  );
}

export default InputDatepicker;
