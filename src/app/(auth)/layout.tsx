import { ReactNode } from "react";

interface IProps {
  children: ReactNode;
}

function AuthLayout({ children }: IProps) {
  return (
    <div className="h-full flex justify-center items-center">{children}</div>
  );
}

export default AuthLayout;
