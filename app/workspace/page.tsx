import Link from "next/link";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth/server";
import { signOut } from "@/app/auth/actions";
import styles from "@/app/auth/account.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Workspace" };

export default async function Workspace({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const client = await authClient();
  if (!client) redirect("/auth");
  const { data: { user } } = await client.auth.getUser();
  if (!user) redirect("/auth");
  const { data, error } = await client.from("account_roles").select("role").eq("user_id", user.id).single();
  const role = !error && (data?.role === "participant" || data?.role === "researcher") ? data.role : null;
  return (
    <main className={`page-content ${styles.page}`}>
      <h1>Your workspace</h1>
      <p className={styles.intro}>Signed in as {user.email}</p>
      <section className={styles.card} aria-labelledby="workspace-access">
        <h2 id="workspace-access">{role === "researcher" ? "Researcher access" : role === "participant" ? "Participant access" : "Account access"}</h2>
        {role ? <p>{role === "researcher"
          ? "Review the proposed experiment and measurement plan before preparing a study for institutional review."
          : "Read the study protocol to learn how independent decisions, AI assistance, and reflection fit together."}</p>
          : <p role="alert">Your workspace role could not be loaded. Refresh the page or contact the study administrator.</p>}
        <Link className={styles.link} href="/protocol">Read the study protocol →</Link>
      </section>
      <form action={signOut}>
        {(await searchParams).error === "signout" && <p role="alert">Sign-out could not be completed. Please try again.</p>}
        <button className={styles.secondary} type="submit">Sign out</button>
      </form>
    </main>
  );
}
