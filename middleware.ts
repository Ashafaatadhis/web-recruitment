import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { Actions, defineAbilityFor, Subjects } from "@/lib/casl/ability";
import { navigationItems } from "@/config/navigation";

const routePermissions = new Map<
  string,
  { action: Actions; subject: Subjects }
>();

[navigationItems.main, navigationItems.secondary].forEach((section) => {
  section.forEach((item) => {
    if (item.permission) {
      // Simpan hanya permission dengan action 'view' saja untuk route protection
      const action = Array.isArray(item.permission.action)
        ? item.permission.action.find((a) => a === "view")
        : item.permission.action;

      if (action === "view") {
        routePermissions.set(item.url, {
          action,
          subject: item.permission.subject as Subjects,
        });
      }
    }
  });
});

export async function middleware(request: NextRequest) {
  const session = await auth();
  const pathname = request.nextUrl.pathname;

  for (const [routePath, permission] of routePermissions.entries()) {
    if (pathname.startsWith(routePath)) {
      // Cek login
      if (!session) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      // Cek permission
      const ability = defineAbilityFor(session.user.role || "");
      const hasAccess = ability.can("view", permission.subject);

      if (!hasAccess) {
        return NextResponse.redirect(new URL("/not-found", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
