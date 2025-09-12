import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function middleware(req) {
  const protectedPaths = ["/add-school"];

  const { pathname } = req.nextUrl;

  const cookieStore = await cookies();

  console.log(cookieStore.getAll());

  if (protectedPaths.includes(pathname)) {
    const token = cookieStore.get("refreshToken")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const l = jwt.verify(token, process.env.JWT_SECRET);
      console.log("====>>>>", l);
      return NextResponse.next();
    } catch (error) {
      // Clear the invalid cookie
      const response = NextResponse.redirect(new URL("/login", req.url));
      cookieStore.delete("refreshToken");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/add-school/:path*"],
};

// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// export function middleware(req) {
//   const protectedPaths = ["/add-school"];
//   const { pathname } = req.nextUrl;

//   if (protectedPaths.includes(pathname)) {
//     const token = req.cookies.get("auth")?.value;

//     if (!token) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//     try {
//       jwt.verify(token, process.env.JWT_SECRET);
//     } catch {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
// };
