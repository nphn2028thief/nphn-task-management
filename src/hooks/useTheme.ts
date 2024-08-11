import { create } from "zustand";
import themes from "../constants/themes";

interface IState {
  selectedTheme: 0 | 1;
  theme: any;
  setSelectedTheme: (value: 0 | 1) => void;
}

const useTheme = create<IState>()((set) => ({
  selectedTheme: 0,
  theme: themes[0],
  setSelectedTheme: (selectedTheme) =>
    set(() => ({ selectedTheme, theme: themes[selectedTheme] })),
}));

export default useTheme;
