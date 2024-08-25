import Sidebar from "@/components/Sidebar";
import Wrapper from "@/components/Wrapper";
import { IChildrenProps } from "@/types/children";

function MainLayout({ children }: IChildrenProps) {
  return (
    <div className="h-full flex gap-6 p-6">
      <Sidebar />
      <Wrapper className="flex-1 relative p-5">{children}</Wrapper>
    </div>
  );
}

export default MainLayout;
