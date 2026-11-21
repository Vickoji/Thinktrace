import Link from "next/link";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth/server";
import { authSettings } from "@/lib/auth/settings";
import { SignInForm } from "./sign-in-form";
import styles from "./account.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sign in" };

export default async function AuthPage() {
  const client = await authClient();
  if (client) {
    const { data } = await client.auth.getUser();
    if (data.user) redirect("/workspace");
  }
  const usesTestInbox = authSettings()?.url === "http://127.0.0.1:54321";
  return (
    <main className={`page-content ${styles.page}`}>
      <h1>Sign in to ThinkTrace</h1>
      <p className={styles.intro}>Use your email to access your workspace. Joining a research study requires separate consent.</p>
      <section className={styles.card} aria-labelledby="account-access">
        <h2 id="account-access">Account access</h2>
        {client ? <>
          <p>{usesTestInbox
            ? "Use a test email address. Your one-time code will appear in the local development inbox on port 54324."
            : "We’ll email you a one-time sign-in code."}</p>
          <SignInForm />
        </> : <p>Email sign-in is unavailable until Supabase is configured for this environment. You can still explore the study protocol.</p>}
      </section>
      <Link className={styles.link} href="/protocol">Read the study protocol →</Link>
    </main>
  );
}
