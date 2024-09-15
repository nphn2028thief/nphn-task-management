import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export const formatDate = (date: string | dayjs.Dayjs | Date) => {
  return dayjs(date).format("YYYY-MM-DD");
};

export const findTreeItemRecursive = <T extends { id: number; children: T[] }>(
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

export function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
