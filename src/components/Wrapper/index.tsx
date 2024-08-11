"use client";

import { CSSProperties, ReactNode } from "react";

import useTheme from "@/hooks/useTheme";

interface IProps {
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
}

function Wrapper(props: IProps) {
  const { style, className, children } = props;

  const { theme } = useTheme((state) => state);

  return (
    <div
      style={{
        ...style,
        backgroundColor: theme.colorBg2,
        border: `2px solid ${theme.borderColor2}`,
        borderRadius: 10,
      }}
      className={className}
    >
      {children}
    </div>
  );
}

export default Wrapper;
