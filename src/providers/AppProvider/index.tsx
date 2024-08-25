"use client";

import { createContext, useState, ReactNode } from "react";

import Portal from "@/components/Portal";
import Loading from "@/components/Loading";
import RenderIf from "@/components/RenderIf";

interface AppContextType {
  isOpenModal: boolean;
  isLoading: boolean;
  setIsOpenModal: (isOpenModal: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const AppContext = createContext<AppContextType>({
  isOpenModal: false,
  isLoading: false,
  setIsOpenModal: () => {},
  setIsLoading: () => {},
});

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isOpenModal, setOpenModal] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const setIsOpenModal = (value: boolean) => setOpenModal(value);
  const setIsLoading = (value: boolean) => setLoading(value);

  return (
    <AppContext.Provider
      value={{ isLoading, isOpenModal, setIsOpenModal, setIsLoading }}
    >
      <RenderIf isTrue={isLoading}>
        <Portal>
          <div
            style={{ backgroundColor: "rgba(0, 0, 0, 0.2)", zIndex: 9999 }}
            className="fixed inset-0"
          >
            <Loading position="fixed" zIndex={9999} />
          </div>
        </Portal>
      </RenderIf>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
