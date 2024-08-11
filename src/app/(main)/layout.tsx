import { ReactNode } from "react";

import Sidebar from "@/components/Sidebar";
import Wrapper from "@/components/Wrapper";

interface IProps {
  children: ReactNode;
}

function MainLayout({ children }: IProps) {
  return (
    <div className="h-full flex gap-6 p-6">
      <Sidebar />
      <Wrapper className="flex-1 relative p-5">
        {/* <div className="h-full"></div> */}
        {children}
      </Wrapper>
    </div>
  );
}

export default MainLayout;
