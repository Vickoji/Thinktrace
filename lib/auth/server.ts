import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { authSettings } from "./settings";

// Server Actions own cookie writes. The request proxy refreshes sessions for server-rendered pages.
export async function authClient(writable = false) {
  const settings = authSettings();
  if (!settings) return null;
  const jar = await cookies();
  return createServerClient(settings.url, settings.key, {
    cookieOptions: { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" },
    cookies: {
      getAll: () => jar.getAll(),
      setAll(changes) {
        if (writable) {
          for (const { name, value, options } of changes) jar.set(name, value, options);
        }
      },
    },
  });
}
