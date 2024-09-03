"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { Menu, Item, Separator, useContextMenu } from "react-contexify";
import { createId } from "@paralleldrive/cuid2";
import axios from "axios";

import RenderIf from "../RenderIf";
import TreeNode from "./TreeNode";
import { EAPI_URL } from "@/constants/path";
import { filePlus, folderPlus, rename, trash } from "@/constants/icons";
import useTree from "@/hooks/useTree";
import { ITree, TFileType, TLevel, Type } from "@/types/tree";
import { findTreeItemRecursive } from "@/lib/utils";

import styles from "./Folders.module.scss";
import "react-contexify/dist/ReactContexify.css";

const MENU_ID = "menu-context-id";

function Folders() {
  const [showContextOverlay, setShowContextOverlay] = useState<boolean>(false);

  const {
    trees,
    treeActive,
    treesActive,
    setTrees,
    setTreeActive,
    setTreesActive,
    setTreeEditId,
  } = useTree((state) => state);

  const { show, hideAll } = useContextMenu({ id: MENU_ID });

  useEffect(() => {
    const controller = new AbortController();

    const getRootTrees = async () => {
      try {
        const { data } = await axios.get(EAPI_URL.TREES, {
          signal: controller.signal,
        });
        console.log(data);
      } catch (error) {}
    };

    getRootTrees();

    return () => {
      controller.abort();
    };
  }, []);

  // Get trees from Session storage
  useEffect(() => {
    const newTrees = sessionStorage.getItem("newTrees");

    if (newTrees) {
      setTrees([...JSON.parse(newTrees)]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddTreeItem = async (type: Type) => {
    const data: ITree = {
      id: createId(),
      name: type === "FOLDER" ? "New Folder 2" : "New File",
      type,
      level: 1,
      isOpen: false,
      children: [],
    };

    const parts = data.name.split(".");
    const fileType = parts.length > 1 ? parts[parts.length - 1] : "txt";
    data.fileType = type === "FILE" ? (fileType as TFileType) : undefined;

    let newTrees = [];

    // const item = findTreeItem(trees, treeActive?.id);
    const parentTree = findTreeItemRecursive<ITree>(
      trees,
      (item) => !!(treeActive && item.id === treeActive.id)
    );

    if (parentTree) {
      // Create inside children of active folder
      data.level = (parentTree.level + 1) as TLevel;
      parentTree.isOpen = true;
      parentTree.children.push(data);

      newTrees = trees.map((prevItem) => {
        if (prevItem.id === parentTree.id) {
          return { ...prevItem, parentTree };
        }

        return prevItem;
      });
    } else {
      // Create at Root folder
      newTrees = [...trees, { ...data }];
    }

    hideAll();
    setTreeActive(data);
    setTreesActive([...treesActive, data]);
    setTreeEditId(data.id);
    setTrees([...newTrees]);

    // try {
    //   const { data: responseData } = await axios.post<IResponse<ITreeResponse>>(
    //     EAPI_URL.TREES,
    //     data
    //   );

    //   if (responseData.errorMessage) {
    //     toast.error(responseData.errorMessage);
    //     return;
    //   }

    //   newTrees = [...trees, { ...responseData }];

    //   // setTreeActive(data);
    //   // setTreeEditId(data.id);
    //   hideAll();
    //   // sessionStorage.setItem("newTrees", JSON.stringify(newTrees));
    //   // setTrees([...newTrees]);
    //   toast.success("Create new folder successfully!");
    // } catch (error) {
    //   toast.error(CATCH_ERROR_MESSAGE);
    // }
  };

  const handleDeleteTreeItemById = (trees: ITree[]): ITree[] => {
    const newTrees = trees.reduce((acc: ITree[], curr) => {
      if (treeActive && curr.id !== treeActive.id) {
        if (curr.children.length) {
          curr.children = handleDeleteTreeItemById(curr.children);
        }
        acc.push(curr);
      }

      return acc;
    }, []);

    // sessionStorage.setItem("newTrees", JSON.stringify(newTrees));
    return newTrees;
  };

  const handleResetTreeActive = () => {
    setShowContextOverlay(false);
    hideAll();
    setTreeActive(null);
    setTreesActive([]);
    setTreeEditId("");
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
          <Item
            onClick={() => {
              if (treeActive) {
                setTrees([...handleDeleteTreeItemById(trees)]);
                handleResetTreeActive();
              }
            }}
          >
            <i className={trash}></i>
            Delete
          </Item>
        </RenderIf>
      </Menu>
    </div>
  );
}

export default Folders;
