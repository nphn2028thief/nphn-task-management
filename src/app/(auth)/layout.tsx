import { IChildrenProps } from "@/types/children";

function AuthLayout({ children }: IChildrenProps) {
  return (
    <div className="h-full flex justify-center items-center">{children}</div>
  );
}

export default AuthLayout;
