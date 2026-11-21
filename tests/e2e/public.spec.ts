import { expect, test } from "@playwright/test";

test("opens the study protocol from the public overview", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Research overview" })).toBeVisible();
  await page.getByRole("link", { name: "Explore the protocol" }).click();
  await expect(page).toHaveURL(/\/protocol$/);
  await expect(page.getByRole("heading", { level: 1, name: "Study protocol" })).toBeVisible();
});

test("research measures and privacy are public", async ({ page }) => {
  for (const [path, heading] of [["/measures", "Research measures"], ["/privacy", "Data & privacy"]]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
  }
});

test("a visitor must sign in before opening the workspace", async ({ page }) => {
  await page.goto("/workspace");
  await expect(page).toHaveURL(/\/auth(?:\?.*)?$/);
  await expect(page.getByRole("heading", { level: 1, name: "Sign in to ThinkTrace" })).toBeVisible();
});

test("switches intervention conditions and exposes the selected option", async ({ page }) => {
  await page.goto("/");
  const chooseReflection = page.getByRole("button", { name: "Structured reflection" });
  await chooseReflection.click();
  await expect(chooseReflection).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("heading", { name: "An explicit appraisal of the advice" })).toBeVisible();
});

test("mobile navigation opens the privacy guide", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Data & privacy" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Data & privacy" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
});
