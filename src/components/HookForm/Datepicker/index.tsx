"use client";

import { Dispatch, memo, SetStateAction, useRef, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useOnClickOutside } from "usehooks-ts";
import { motion } from "framer-motion";
import clsx from "clsx";

import Portal from "@/components/Portal";
import { DAYS } from "@/constants/datepicker";
import { cn } from "@/lib/utils";
import { generateDate, months } from "@/lib/calendar";

import styles from "./Datepicker.module.scss";

dayjs.extend(customParseFormat);

interface IProps {
  position: any;
  value: string;
  setShowDatepicker: Dispatch<SetStateAction<boolean>>;
  onClick?: (date: dayjs.Dayjs) => void;
}

function Datepicker(props: IProps) {
  const { position, value, setShowDatepicker, onClick } = props;

  const currentDate = useRef<dayjs.Dayjs>(dayjs());
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [today, setToday] = useState<dayjs.Dayjs>(currentDate.current);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs(value));

  useOnClickOutside(wrapperRef, () => setShowDatepicker(false));

  return (
    <Portal>
      <motion.div
        ref={wrapperRef}
        style={{ top: position.top, right: position.right }}
        className={clsx(styles.wrapper)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center">
          <h1 className="font-semibold select-none">
            {months[today.month()]}, {today.year()}
          </h1>
          <div className="flex gap-1 items-center">
            <button
              className="flex justify-center items-center px-2 py-1.5 hover:scale-105 transition-all"
              onClick={() => {
                setToday(today.month(today.month() - 1));
              }}
            >
              <i className="fa-solid fa-angle-left"></i>
            </button>
            <button
              className="flex-1 px-4 py-1 text-sm hover:scale-105 transition-all"
              onClick={() => {
                setToday(currentDate.current);
                setSelectedDate(currentDate.current);
                onClick && onClick(currentDate.current);
              }}
            >
              Today
            </button>
            <button
              className="flex justify-center items-center px-2 py-1.5 hover:scale-105 transition-all"
              onClick={() => {
                setToday(today.month(today.month() + 1));
              }}
            >
              <i className="fa-solid fa-angle-right"></i>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7">
          {DAYS.map((day, index) => {
            return (
              <p
                key={index}
                className="h-11 grid place-content-center text-sm text-center text-gray-500 select-none"
              >
                {day}
              </p>
            );
          })}
        </div>

        <div className="grid grid-cols-7">
          {generateDate(today.month(), today.year()).map(
            ({ date, currentMonth, today }, index) => {
              return (
                <div
                  key={index}
                  className="h-11 grid place-content-center text-sm"
                >
                  <p
                    className={cn(
                      !currentMonth && clsx(styles["no-current-month-dates"]),
                      today &&
                        clsx(
                          styles["current-month-dates"],
                          styles["current-month-dates-bg"]
                        ),
                      selectedDate.toDate().toDateString() ===
                        date.toDate().toDateString() &&
                        clsx(
                          styles["current-month-dates"],
                          styles["current-month-dates-bg-selected"]
                        ),
                      `w-8 h-8 rounded-full grid place-content-center transition-all cursor-pointer select-none ${clsx(
                        styles.date
                      )}`
                    )}
                    onClick={() => {
                      setSelectedDate(date);
                      onClick && onClick(date);
                    }}
                  >
                    {date.date()}
                  </p>
                </div>
              );
            }
          )}
        </div>
      </motion.div>
    </Portal>
  );
}

export default memo(Datepicker);
