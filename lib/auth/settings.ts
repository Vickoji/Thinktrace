export type AuthSettings = { url: string; key: string };

export function readAuthSettings(
  environment: { SUPABASE_URL?: string; SUPABASE_PUBLISHABLE_KEY?: string }
): AuthSettings | null {
  const key = environment.SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!environment.SUPABASE_URL || !key) return null;
  try {
    const url = new URL(environment.SUPABASE_URL);
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    if (url.protocol !== "https:" && !(local && url.protocol === "http:")) return null;
    if (url.username || url.password || url.search || url.hash) return null;
    return { url: url.href.replace(/\/$/, ""), key };
  } catch {
    return null;
  }
}

export function authSettings() {
  return readAuthSettings({
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY,
  });
}
