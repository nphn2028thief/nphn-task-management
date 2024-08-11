"use client";

import { createContext, useState, ReactNode } from "react";

import Portal from "@/components/Portal";
import Loading from "@/components/Loading";

interface AppContextType {
  isOpenPanel: boolean;
  isLoading: boolean;
  setIsOpenPanel: (isOpenPanel: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const AppContext = createContext<AppContextType>({
  isOpenPanel: false,
  isLoading: false,
  setIsOpenPanel: () => {},
  setIsLoading: () => {},
});

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isOpenPanel, setOpenPanel] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const setIsOpenPanel = (value: boolean) => setOpenPanel(value);
  const setIsLoading = (value: boolean) => setLoading(value);

  return (
    <AppContext.Provider
      value={{ isLoading, isOpenPanel, setIsOpenPanel, setIsLoading }}
    >
      {isLoading && (
        <Portal>
          <div
            style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
            className="fixed inset-0 z-[99999]"
          >
            <Loading position="fixed" />
          </div>
        </Portal>
      )}
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
