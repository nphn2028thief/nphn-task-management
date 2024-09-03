<div key={item.id} className={clsx(styles["tree-item-wrapper"])}>
            <div
              className={clsx(
                styles["tree-item"],
                treeActive?.id === item.id && styles["tree-item-active"],
                "truncate"
              )}
              onClick={() => setTreeActive(item)}
              onDoubleClick={() => handleDoubleClick(item)}
            >
              {item.type === "folder" ? (
                <i
                  className={
                    item.isOpen && item.children.length ? folderOpen : folder
                  }
                ></i>
              ) : (
                <i className={file}></i>
              )}

              {isEdit && treeActive?.id === item.id ? (
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={`Enter new ${item.type} name.`}
                  className="w-full"
                />
              ) : (
                <p>
                  {item.type === "file" && item.fileType
                    ? `${item.name}.${item.fileType}`
                    : item.name}
                </p>
              )}
            </div>

            <RenderIf isTrue={item.isOpen && item.children.length !== 0}>
              <div className="relative ml-7 mt-2">
                {handleRenderTree(item.children)}
              </div>
            </RenderIf>
          </div>
