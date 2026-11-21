export function normalizeEmail(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return null;
  const email = value.trim();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

export function normalizeCode(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return null;
  const token = value.trim();
  return /^[0-9]{6,10}$/.test(token) ? token : null;
}

export type SignInState = { email: string; step: "email" | "code"; message: string };
