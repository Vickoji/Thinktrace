import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { authSettings } from "./lib/auth/settings";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const settings = authSettings();
  if (settings) {
    const client = createServerClient(settings.url, settings.key, {
      cookieOptions: { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" },
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(changes) {
          for (const { name, value } of changes) request.cookies.set(name, value);
          response = NextResponse.next({ request });
          for (const { name, value, options } of changes) response.cookies.set(name, value, options);
        },
      },
    });
    await client.auth.getUser();
  }
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = { matcher: ["/auth", "/workspace/:path*"] };
