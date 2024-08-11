"use client";

import { useRouter, usePathname } from "next/navigation";
import clsx from "clsx";
import { SignOutButton, useClerk, UserButton, useUser } from "@clerk/nextjs";

import Wrapper from "../Wrapper";
import CMenu from "@/constants/menu";
import { logout } from "@/constants/icons";
import useTheme from "@/hooks/useTheme";

import styles from "./Sidebar.module.scss";

function Sidebar() {
  const { theme } = useTheme((state) => state);

  const router = useRouter();
  const pathname = usePathname();

  const { user } = useUser();
  const { redirectToSignIn } = useClerk();

  return (
    <Wrapper
      style={{
        width: theme.sidebarWidth,
        color: theme.colorGrey3,
      }}
      className={clsx(styles.wrapper)}
    >
      {/* Profile */}
      <div style={{ color: theme.colorGrey0 }} className={clsx(styles.profile)}>
        <div
          style={{
            background: theme.colorBg3,
            borderColor: theme.borderColor2,
          }}
          className={clsx(styles["profile-overlay"])}
        ></div>
        <UserButton
          appearance={{
            elements: {
              avatarBox: {
                width: 70,
                height: 70,
                display: "flex",
                borderRadius: "50%",
                overflow: "hidden",
              },
            },
          }}
        />
        <h1 className={clsx(styles["profile-info"])}>
          <span>{user?.firstName}</span>
          <span>{user?.lastName}</span>
        </h1>
      </div>

      <div className="h-full flex flex-col overflow-auto pr-2.5 -mr-3">
        {/* Menu */}
        <ul className={clsx(styles.nav)}>
          {CMenu.map((item) => (
            <li
              key={item.id}
              className={clsx(
                styles["nav-item"],
                pathname === item.link && styles["nav-item-active"]
              )}
              onClick={() => router.push(item.link)}
            >
              <i className={item.icon}></i>
              {item.title}
            </li>
          ))}
        </ul>

        <div className={clsx(styles["sign-out"])}>
          <SignOutButton>
            <button onClick={() => redirectToSignIn()}>
              <i className={logout}></i>
              sign out
            </button>
          </SignOutButton>
        </div>
      </div>
    </Wrapper>
  );
}

export default Sidebar;
