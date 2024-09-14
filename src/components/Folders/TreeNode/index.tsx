"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";

import { file, folder, folderOpen } from "@/constants/icons";
import { ITree, ITreeResponse } from "@/types/tree";
import { findTreeItemRecursive } from "@/lib/utils";

import styles from "../Folders.module.scss";
import { TreeContext } from "@/providers/TreeProvider";
import axios from "axios";
import { IResponse } from "@/types/api";
import { EAPI_URL } from "@/constants/path";
import { CATCH_ERROR_MESSAGE } from "@/constants";
import RenderIf from "@/components/RenderIf";

interface IProps {
  node: ITree;
}

function TreeNode(props: IProps) {
  const { node } = props;

  const router = useRouter();

  const [newName, setNewName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    trees,
    isLoadingTree,
    treeActive,
    treeEditId,
    setTrees,
    setIsLoadingTree,
    setTreeActive,
    setTreeEditId,
  } = useContext(TreeContext);

  // Get name for rename tree
  useEffect(() => {
    if (treeActive) {
      setNewName(treeActive.name);
    }
  }, [treeActive]);

  // Focus and select when edit tree
  useEffect(() => {
    if (inputRef.current && treeEditId === node.id) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [treeEditId, node.id]);

  const handleCloseAllChildren = (trees: ITree[]): ITree[] => {
    return trees.map((item) => ({
      ...item,
      isOpen: false,
      children: handleCloseAllChildren(item.children),
    }));
  };

  const handleUpdateIsOpen = (
    trees: ITree[],
    id: number,
    childrenNodes: ITree[]
  ): ITree[] => {
    const newTrees = trees.map((item) => {
      // Case item has isOpen = true
      if (item.id === id && item.children.length && item.isOpen) {
        return {
          ...item,
          isOpen: false,
          children: handleCloseAllChildren(item.children),
        };
      }

      if (item.id === id) {
        return { ...item, isOpen: !item.isOpen, children: [...childrenNodes] };
      }

      if (item.children.length) {
        return {
          ...item,
          children: handleUpdateIsOpen(item.children, id, childrenNodes),
        };
      }

      return { ...item };
    });

    return newTrees;
  };

  const handleOpenFolder = async (treeItem: ITree) => {
    const updateTreeWithChildren = (children: ITree[]) => {
      const item = findTreeItemRecursive<ITree>(
        trees,
        (item) => !!(treeItem.id && item.id === treeItem.id)
      );

      return item
        ? handleUpdateIsOpen(trees, treeItem.id, children)
        : [...trees];
    };

    if (treeItem.children.length) {
      setTrees(updateTreeWithChildren(treeItem.children));
      return;
    }

    setIsLoadingTree(true);

    try {
      const { data: childrenNodeData } = await axios.get<
        IResponse<ITreeResponse[]>
      >(`${EAPI_URL.TREES}/${treeItem.id}`);

      if (childrenNodeData.errorMessage) {
        toast.error(childrenNodeData.errorMessage);
        return;
      }

      if (!childrenNodeData.data.length) {
        toast.error("This folder has no files.");
        return;
      }

      setTrees(updateTreeWithChildren(childrenNodeData.data));
    } catch (error) {
      toast.error(CATCH_ERROR_MESSAGE);
    } finally {
      setIsLoadingTree(false);
    }
  };

  const handleDoubleClick = (treeItem: ITree) => {
    if (treeItem.type === "FILE") {
      return router.push(`/file/${treeItem.id}`);
    }

    return handleOpenFolder(treeItem);
  };

  const handleUpdateTreeItem = () => {
    if (newName === treeActive?.name) {
      setTreeEditId(NaN);
      return;
    }

    const updateTreeItemById = (trees: ITree[]): ITree[] => {
      return trees.map((item) => {
        if (item.id === treeEditId) {
          return { ...item, name: newName };
        }

        if (item.children.length) {
          return { ...item, children: updateTreeItemById(item.children) };
        }

        return item;
      });
    };

    setTrees([...updateTreeItemById(trees)]);
    setTreeEditId(NaN);
  };

  return (
    <div className={clsx(styles["tree-item-wrapper"])}>
      <div
        className={clsx(
          styles["tree-item"],
          node.id === treeActive?.id && styles["tree-item-active"],
          "truncate"
        )}
        onClick={(e) => {
          e.stopPropagation();
          setTreeActive(node);
          setTreeEditId(NaN);
        }}
        onDoubleClick={() => handleDoubleClick(node)}
      >
        {node.type === "FOLDER" ? (
          <i
            className={`${
              node.isOpen && node.children.length ? folderOpen : folder
            } w-[18px] h-[18px] flex`}
          ></i>
        ) : (
          <i className={file}></i>
        )}

        {treeEditId === node.id ? (
          <input
            ref={inputRef}
            type="text"
            value={newName}
            className="w-full"
            placeholder={`Enter new ${node.type} name.`}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleUpdateTreeItem}
          />
        ) : (
          <p>
            {node.type === "FILE" && node.fileType
              ? `${node.name}.${node.fileType}`
              : node.name}
          </p>
        )}

        <RenderIf isTrue={!!(isLoadingTree && treeActive?.id === node.id)}>
          <span className={clsx(styles.loader)}></span>
        </RenderIf>
      </div>

      <AnimatePresence>
        {node.isOpen && node.children.length && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative ml-7 mt-2"
          >
            {node.children.map((child) => (
              <TreeNode key={child.id} node={child} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TreeNode;
