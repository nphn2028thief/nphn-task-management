import { AppProvider } from "./AppProvider";
import { TaskProvider } from "./TaskProvider";
// import { TreeProvider } from "./TreeProvider";
import { IChildrenProps } from "@/types/children";

function RootProvider({ children }: IChildrenProps) {
  return (
    <AppProvider>
      <TaskProvider>
        {/* <TreeProvider>{children}</TreeProvider> */}
        {children}
      </TaskProvider>
    </AppProvider>
  );
}

export default RootProvider;
