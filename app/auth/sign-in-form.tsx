"use client";

import { useActionState } from "react";
import { signIn } from "./actions";
import styles from "./account.module.css";
import type { SignInState } from "@/lib/auth/input";

const initial: SignInState = { email: "", step: "email", message: "" };

export function SignInForm() {
  const [state, action, pending] = useActionState(signIn, initial);
  const hasCode = state.step === "code";
  return (
    <form action={action} className={styles.form} key={state.step}>
      <input type="hidden" name="step" value={state.step} />
      <label htmlFor="email">Email address</label>
      <input id="email" name="email" type="email" autoComplete="email" defaultValue={state.email} readOnly={hasCode} required maxLength={254} />
      {hasCode && <>
        <label htmlFor="code">Sign-in code</label>
        <input id="code" name="code" type="text" autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6,10}" maxLength={10} autoFocus required aria-describedby="code-hint" />
        <p id="code-hint" className={styles.hint}>Check your inbox for your one-time code.</p>
      </>}
      {state.message && <p className={styles.error} role="alert">{state.message}</p>}
      <button disabled={pending} className={styles.primary} type="submit">{pending ? "Please wait…" : hasCode ? "Verify code" : "Send code"}</button>
      {hasCode && <a className={styles.link} href="/auth">Use another email or request a new code</a>}
    </form>
  );
}
