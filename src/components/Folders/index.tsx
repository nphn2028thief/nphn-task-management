"use client";

import { useContext, useState } from "react";
import clsx from "clsx";
import { Menu, Item, Separator, useContextMenu } from "react-contexify";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

import { AppContext } from "@/providers/AppProvider";
import { TreeContext } from "@/providers/TreeProvider";
import RenderIf from "../RenderIf";
import TreeNode from "./TreeNode";
import { EAPI_URL } from "@/constants/path";
import { CATCH_ERROR_MESSAGE } from "@/constants";
import { filePlus, folderPlus, rename, trash } from "@/constants/icons";
import { IResponse } from "@/types/api";
import { ITree, ITreeRequest, ITreeResponse, TLevel, Type } from "@/types/tree";
import { findTreeItemRecursive } from "@/lib/utils";

import styles from "./Folders.module.scss";
import "react-contexify/dist/ReactContexify.css";

const MENU_ID = "menu-context-id";

function Folders() {
  const [showContextOverlay, setShowContextOverlay] = useState<boolean>(false);

  const { setIsLoading } = useContext(AppContext);
  const {
    trees,
    treeActive,
    setTrees,
    setIsLoadingTree,
    setTreeActive,
    setTreeEditId,
  } = useContext(TreeContext);

  const { user } = useUser();

  const { show, hideAll } = useContextMenu({ id: MENU_ID });

  const handleAddTreeItem = async (type: Type) => {
    const getLevel = () => {
      if (treeActive) {
        switch (treeActive.level) {
          case 1:
            return 2;
          case 2:
            return 3;
          case 3:
            return 4;
          default:
            return 4;
        }
      }

      return 1;
    };

    const requestData: ITreeRequest = {
      name: type === "FILE" ? "file" : "New folder",
      type,
      fileType: type === "FILE" ? "txt" : undefined,
      level: getLevel(),
      isOpen: false,
      parentId: treeActive?.id ?? null,
    };

    if (treeActive && treeActive.id) {
      // Loading on parent node
      setIsLoadingTree(true);
    } else {
      // Global loading
      setIsLoading(true);
    }

    try {
      const { data: responseData } = await axios.post<IResponse<ITreeResponse>>(
        EAPI_URL.TREES,
        requestData
      );

      if (responseData.errorMessage) {
        toast.error(responseData.errorMessage);
        return;
      }

      // Case has parent id (child node)
      if (treeActive && treeActive.id) {
        try {
          const { data: childrenNodeData } = await axios.get<
            IResponse<ITreeResponse[]>
          >(`${EAPI_URL.TREES}/${treeActive.id}`);

          if (childrenNodeData.errorMessage) {
            toast.error(childrenNodeData.errorMessage);
            return;
          }

          const handleUpdateTrees = (trees: ITree[]) => {
            return trees.map((item) => {
              if (item.id === treeActive.id) {
                return {
                  ...item,
                  isOpen: true,
                  children: [...childrenNodeData.data],
                };
              }

              if (item.children.length) {
                handleUpdateTrees(item.children);
              }

              return item;
            });
          };

          const updatedTrees = handleUpdateTrees(trees);
          setTrees(updatedTrees);
          return;
        } catch (error) {
          toast.error(CATCH_ERROR_MESSAGE);
        }
      }

      // Case root node
      setTrees([...trees, { ...responseData.data }]);
    } catch (error) {
      toast.error(CATCH_ERROR_MESSAGE);
    } finally {
      setShowContextOverlay(false);
      setIsLoading(false);
      setIsLoadingTree(false);
    }
  };

  const handleDeleteTreeItemById = async () => {
    // const newTrees = trees.reduce((acc: ITree[], curr) => {
    //   if (treeActive && curr.id !== treeActive.id) {
    //     if (curr.children.length) {
    //       curr.children = handleDeleteTreeItemById(curr.children);
    //     }
    //     acc.push(curr);
    //   }

    //   return acc;
    // }, []);

    if (treeActive) {
      setIsLoading(true);

      try {
        const { data: responseData } = await axios.delete<IResponse<number>>(
          `${EAPI_URL.TREES}/${treeActive?.id}`
        );

        if (responseData.errorMessage) {
          toast.error(responseData.errorMessage);
          return;
        }

        const filterTree = (trees: ITree[]): ITree[] => {
          return trees
            .filter((item) => {
              // Điều kiện loại bỏ phần tử có id hoặc parentId trùng với responseData.data
              return (
                item.id !== responseData.data &&
                item.parentId !== responseData.data
              );
            })
            .map((item) => {
              // Nếu có children, áp dụng filter đệ quy
              if (item.children.length) {
                return {
                  ...item,
                  children: filterTree(item.children), // Lọc lại children
                };
              }
              return item; // Không có children thì trả về chính item
            });
        };

        setTrees(filterTree(trees));
      } catch (error) {
        toast.error(CATCH_ERROR_MESSAGE);
      } finally {
        setIsLoading(false);
        handleResetTreeActive();
      }
    }
  };

  const handleResetTreeActive = () => {
    setShowContextOverlay(false);
    hideAll();
    setTreeActive(null);
    setTreeEditId(NaN);
  };

  return (
    <div
      className={clsx(styles.wrapper)}
      onContextMenu={(event) => {
        event.preventDefault();
        show({ event });
        setShowContextOverlay(true);
      }}
      onClick={handleResetTreeActive}
    >
      {trees
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((item) => (
          <TreeNode key={item.id} node={item} />
        ))}

      {/* Overlay of menu context */}
      <RenderIf isTrue={showContextOverlay}>
        <div className="absolute inset-0 z-10"></div>
      </RenderIf>

      {/* Menu context */}
      <Menu id={MENU_ID} theme="dark" animation="slide" tabIndex={-1}>
        <RenderIf
          isTrue={
            !!(
              !treeActive ||
              (treeActive?.type !== "FILE" && treeActive.level < 3)
            )
          }
        >
          <Item onClick={() => handleAddTreeItem("FOLDER")}>
            <i className={folderPlus}></i>
            New Folder
          </Item>
        </RenderIf>
        <RenderIf isTrue={!!(treeActive?.type !== "FILE")}>
          <Item onClick={() => handleAddTreeItem("FILE")}>
            <i className={filePlus}></i>
            New File (txt, md)
          </Item>
        </RenderIf>
        <RenderIf isTrue={!!treeActive?.id}>
          <RenderIf isTrue={!!(treeActive?.type !== "FILE")}>
            <Separator />
          </RenderIf>
          <Item onClick={() => treeActive && setTreeEditId(treeActive.id)}>
            <i className={rename}></i>
            Rename
          </Item>
          <Item onClick={handleDeleteTreeItemById}>
            <i className={trash}></i>
            Delete
          </Item>
        </RenderIf>
      </Menu>
    </div>
  );
}

export default Folders;
