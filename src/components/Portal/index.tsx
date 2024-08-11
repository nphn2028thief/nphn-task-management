"use client";

import { ReactNode, ReactPortal, useEffect, useState } from "react";
import ReactDOM from "react-dom";

interface IProps {
  children: ReactNode;
  target?: string;
}

function Portal(props: IProps): ReactPortal | null {
  const { children, target } = props;

  const [wrapper, setWrapper] = useState<HTMLDivElement | undefined>();

  useEffect(() => {
    let portal = document.querySelector(
      String(target)
    ) as HTMLDivElement | null;

    if (!portal) {
      portal = document.createElement("div");
      document.body.appendChild(portal);
    }

    setWrapper(portal);

    return () => {
      if (!target) {
        document.body.removeChild(portal!);
      }
    };
  }, [target]);

  if (!wrapper) return null;

  return ReactDOM.createPortal(children, wrapper);
}

export default Portal;
