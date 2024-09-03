import { create } from "zustand";
import themes from "../constants/themes";
import { ITree } from "@/types/tree";
import { Dispatch, SetStateAction } from "react";

export const DATA: ITree[] = [
  {
    id: "1",
    name: "Root folder 1",
    type: "FOLDER",
    level: 1,
    isOpen: false,
    children: [],
  },
  {
    id: "2",
    name: "Root folder 2",
    type: "FOLDER",
    level: 1,
    isOpen: false,
    children: [
      {
        id: "21",
        name: "Folder 1",
        type: "FOLDER",
        level: 2,
        isOpen: false,
        children: [
          {
            id: "211",
            name: "Sub folder 1",
            type: "FOLDER",
            level: 3,
            isOpen: false,
            children: [
              {
                id: "2111",
                name: "File 1",
                type: "FILE",
                fileType: "txt",
                level: 4,
                isOpen: false,
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: "22",
        name: "Folder 2",
        type: "FOLDER",
        level: 2,
        isOpen: false,
        children: [],
      },
    ],
  },
  {
    id: "3",
    name: "Root folder 3",
    type: "FOLDER",
    level: 1,
    isOpen: false,
    children: [
      {
        id: "31",
        name: "Folder 1",
        type: "FOLDER",
        level: 2,
        isOpen: false,
        children: [],
      },
    ],
  },
  {
    id: "4",
    name: "Root folder 4",
    type: "FOLDER",
    level: 1,
    isOpen: false,
    children: [],
  },
  {
    id: "5",
    name: "Root folder 5",
    type: "FOLDER",
    level: 1,
    isOpen: false,
    children: [],
  },
  {
    id: "6",
    name: "Root folder 6",
    type: "FOLDER",
    level: 1,
    isOpen: false,
    children: [],
  },
  {
    id: "7",
    name: "Root folder 7",
    type: "FOLDER",
    level: 1,
    isOpen: false,
    children: [],
  },
];

interface IState {
  trees: ITree[];
  treeActive: ITree | null;
  treesActive: ITree[];
  treeEditId: string;
  setTrees: (trees: ITree[]) => void;
  setTreeActive: (treeActive: ITree | null) => void;
  setTreesActive: (treeActive: ITree[]) => void;
  setTreeEditId: (id: string) => void;
}

const useTree = create<IState>()((set) => ({
  trees: DATA,
  treeActive: null,
  treesActive: [],
  treeEditId: "",
  setTrees: (trees) => set(() => ({ trees })),
  setTreeActive: (treeActive) => set(() => ({ treeActive })),
  setTreesActive: (treesActive) => set(() => ({ treesActive })),
  setTreeEditId: (treeEditId) => set(() => ({ treeEditId })),
}));

export default useTree;
