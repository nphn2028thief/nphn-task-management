"use client";

import { createContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";

import { CATCH_ERROR_MESSAGE } from "@/constants";
import { EAPI_URL } from "@/constants/path";
import { IResponse } from "@/types/api";
import { ITree } from "@/types/tree";
import { IChildrenProps } from "@/types/children";

interface TreeContextType {
  trees: ITree[];
  isLoadingTree: boolean;
  treeActive: ITree | null;
  treeEditId: number;
  setTrees: (trees: ITree[]) => void;
  setIsLoadingTree: (isLoadingTree: boolean) => void;
  setTreeActive: (treeActive: ITree | null) => void;
  setTreeEditId: (id: number) => void;
}

const TreeContext = createContext<TreeContextType>({
  trees: [],
  isLoadingTree: false,
  treeActive: null,
  treeEditId: NaN,
  setTrees: () => {},
  setIsLoadingTree: () => {},
  setTreeActive: () => {},
  setTreeEditId: () => {},
});

function TreeProvider({ children }: IChildrenProps) {
  const [trees, setTrees] = useState<ITree[]>([]);
  const [isLoadingTree, setIsLoadingTree] = useState<boolean>(false);
  const [treeActive, setTreeActive] = useState<ITree | null>(null);
  const [treeEditId, setTreeEditId] = useState<number>(NaN);

  const { user } = useUser();

  // Get all root nodes
  useEffect(() => {
    setIsLoadingTree(true);

    const controller = new AbortController();
    const { signal } = controller;

    const getAllTrees = async () => {
      try {
        const { data } = await axios.get<IResponse<ITree[]>>(EAPI_URL.TREES, {
          signal,
        });

        if (data.errorMessage) {
          toast.error(data.errorMessage);
          return;
        }

        setTrees(data.data);
        setIsLoadingTree(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          return;
        }

        setIsLoadingTree(false);
        toast.error(CATCH_ERROR_MESSAGE);
      }
    };

    user && getAllTrees();

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TreeContext.Provider
      value={{
        trees,
        isLoadingTree,
        treeActive,
        treeEditId,
        setTrees,
        setIsLoadingTree,
        setTreeActive,
        setTreeEditId,
      }}
    >
      {children}
    </TreeContext.Provider>
  );
}

export { TreeContext, TreeProvider };
