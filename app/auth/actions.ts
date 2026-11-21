"use server";

import { redirect } from "next/navigation";
import { normalizeCode, normalizeEmail, type SignInState } from "@/lib/auth/input";
import { authClient } from "@/lib/auth/server";

export async function signIn(_previous: SignInState, data: FormData): Promise<SignInState> {
  const email = normalizeEmail(data.get("email"));
  if (!email) return { step: "email", email: "", message: "Enter a valid email address." };
  const step = data.get("step") === "code" ? "code" : "email";
  const client = await authClient(true);
  if (!client) return { step, email, message: "Email sign-in is unavailable in this environment." };
  if (step === "email") {
    const { error } = await client.auth.signInWithOtp({ email });
    if (error) {
      const message = error.status === 429 ? "Please wait a minute before requesting another code." : "We could not send a code. Please try again later.";
      return { step, email, message };
    }
    return { step: "code", email, message: "" };
  }
  const token = normalizeCode(data.get("code"));
  if (!token) return { step, email, message: "Enter the numeric code from your email." };
  const { error } = await client.auth.verifyOtp({ email, token, type: "email" });
  if (error) return { step, email, message: "The code could not be verified. Try again or request a new code." };
  redirect("/workspace");
}

export async function signOut() {
  const client = await authClient(true);
  if (client) {
    const { error } = await client.auth.signOut({ scope: "local" });
    if (error) redirect("/workspace?error=signout");
  }
  redirect("/auth");
}
