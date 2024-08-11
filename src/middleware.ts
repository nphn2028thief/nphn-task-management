import { authMiddleware, redirectToSignIn } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { EPath } from "./constants/path";

export default authMiddleware({
  // afterAuth: (auth, req) => {
  //   if (auth.userId) {
  //     return NextResponse.redirect(new URL(EPath.HOME, req.url));
  //   }
  //   return redirectToSignIn({ returnBackUrl: req.url });
  // },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
