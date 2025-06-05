import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { Actions, defineAbilityFor, Subjects } from "@/lib/casl/ability";
import { hiddenProtectedRoutes, navigationItems } from "@/config/navigation";
import convertPathToRegex from "./lib/utils/convert-to-regex";

type RoutePermission = {
  path: string;
  regex: RegExp;
  action: Actions;
  subject: Subjects;
  isHidden?: boolean;
};

const routePermissions: RoutePermission[] = [];

[
  { items: navigationItems.main, isHidden: false },
  { items: navigationItems.secondary, isHidden: false },
  { items: hiddenProtectedRoutes, isHidden: true },
].forEach(({ items, isHidden }) => {
  items.forEach((item) => {
    if (item.permission) {
      routePermissions.push({
        path: item.url,
        regex: convertPathToRegex(item.url),
        action: item.permission.action as Actions,
        subject: item.permission.subject as Subjects,
        isHidden,
      });
    }
  });
});

export async function middleware(request: NextRequest) {
  const session = await auth();
  const pathname = request.nextUrl.pathname;

  // Blokir akses ke /login dan /register jika sudah login
  if (session) {
    if (pathname === "/login" || pathname === "/register") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  for (const permission of routePermissions) {
    if (permission.regex.test(pathname)) {
      if (!session) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const ability = defineAbilityFor(session.user.role || "");
      const hasAccess = Array.isArray(permission.action)
        ? permission.action.every((a) => ability.can(a, permission.subject))
        : ability.can(permission.action, permission.subject);

      if (!hasAccess) {
        return NextResponse.redirect(new URL("/not-found", request.url));
      }

      break; // stop after first match
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
