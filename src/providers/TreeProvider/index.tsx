"use client";

import { createContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";

import { CATCH_ERROR_MESSAGE } from "@/constants";
import { EAPI_URL } from "@/constants/path";
import { IResponse } from "@/types/api";
import { ITree, ITreeResponse } from "@/types/tree";
import { IChildrenProps } from "@/types/children";

interface TreeContextType {
  trees: ITree[];
  setTrees: (trees: ITree[]) => void;
}

const TreeContext = createContext<TreeContextType>({
  trees: [],
  setTrees: () => {},
});

function TreeProvider({ children }: IChildrenProps) {
  const [trees, setTrees] = useState<ITree[]>([]);

  const { user } = useUser();

  useEffect(() => {
    const getAllTrees = async () => {
      try {
        const { data } = await axios.get<IResponse<ITreeResponse[]>>(
          EAPI_URL.TREES
        );

        if (data.errorMessage) {
          toast.error(data.errorMessage);
          return;
        }
      } catch (error) {
        toast.error(CATCH_ERROR_MESSAGE);
      }
    };

    user && getAllTrees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TreeContext.Provider
      value={{
        trees,
        setTrees,
      }}
    >
      {children}
    </TreeContext.Provider>
  );
}

export { TreeContext, TreeProvider };
