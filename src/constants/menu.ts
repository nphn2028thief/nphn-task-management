import { check, home, list, todo } from "./icons";
import { EPath } from "./path";
import IMenu from "@/types/menu";

const CMenu: IMenu[] = [
  {
    id: 1,
    title: "all tasks",
    icon: home,
    link: EPath.HOME,
  },
  {
    id: 2,
    title: "important",
    icon: list,
    link: EPath.IMPORTANT,
  },
  {
    id: 3,
    title: "completed",
    icon: check,
    link: EPath.COMPLETED,
  },
  {
    id: 4,
    title: "must do",
    icon: todo,
    link: EPath.INCOMPLETED,
  },
];

export default CMenu;
