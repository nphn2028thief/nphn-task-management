import moment from "moment";

export const formatDate = (date: string) => {
  return moment(date).format("DD/MM/YYYY");
};

export const findTreeItemRecursive = <T extends { id: string; children: T[] }>(
  trees: T[],
  predicate: (item: T) => boolean
): T | undefined => {
  for (const item of trees) {
    // predicate is a function will return boolean value. E.g: !!(treeActive && item.id === treeActive.id)
    if (predicate(item)) {
      return item;
    }

    if (item.children.length) {
      // Recursive in children's item
      const found = findTreeItemRecursive(item.children, predicate);
      if (found) {
        return found;
      }
    }
  }

  return undefined;
};
