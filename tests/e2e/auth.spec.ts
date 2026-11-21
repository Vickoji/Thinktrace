import { randomUUID } from "node:crypto";
import { expect, test, type APIRequestContext } from "@playwright/test";

// The opt-in test uses only the local Supabase mail sink and a reserved test domain.
const mailpit = "http://127.0.0.1:54324/api/v1";

async function readCode(request: APIRequestContext, email: string) {
  const search = await request.get(`${mailpit}/search`, { params: { query: `to:${email}` } });
  expect(search.ok()).toBeTruthy();
  const { messages } = await search.json();
  if (!messages?.length) return null;
  const response = await request.get(`${mailpit}/message/${encodeURIComponent(messages[0].ID)}`);
  expect(response.ok()).toBeTruthy();
  const { Text, HTML } = await response.json();
  return String(Text || HTML).match(/\b\d{6,10}\b/)?.[0] ?? null;
}

test("email code opens a workspace, persists on reload and signs out", async ({ page, request }) => {
  test.skip(process.env.E2E_LOCAL_AUTH !== "1", "Requires local Supabase with Mailpit on port 54324.");
  const email = `test-${randomUUID()}@example.test`;
  await page.goto("/auth");
  await page.getByLabel("Email address").fill(email);
  await page.getByRole("button", { name: "Send code" }).click();
  await expect(page.getByLabel("Sign-in code")).toBeVisible();
  let code: string | null = null;
  await expect.poll(async () => {
    code = await readCode(request, email);
    return Boolean(code);
  }, { timeout: 12_000 }).toBeTruthy();
  const incorrectCode = code === "000000" ? "000001" : "000000";
  await page.getByLabel("Sign-in code").fill(incorrectCode);
  await page.getByRole("button", { name: "Verify code" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("could not be verified");
  await page.getByLabel("Sign-in code").fill(String(code));
  await page.getByRole("button", { name: "Verify code" }).click();
  await expect(page).toHaveURL(/\/workspace$/);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Your workspace" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Participant access" })).toBeVisible();
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/auth$/);
  await page.goto("/workspace");
  await expect(page).toHaveURL(/\/auth(?:\?.*)?$/);
});
