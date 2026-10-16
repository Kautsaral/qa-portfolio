import { test, expect } from "@playwright/test";

test.describe("Experience Section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#experience");
  });

  test("displays the Experience section heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", {
        name: "My professional journey.",
      }),
    ).toBeVisible();
  });

  test("displays published experience after loading", async ({ page }) => {
    await expect(page.getByText("Loading experience...")).not.toBeVisible();

    const experienceCards = page.locator("#experience article");

    await expect(experienceCards.first()).toBeVisible();
    await expect(experienceCards).not.toHaveCount(0);
  });

  test("each experience displays a role and company", async ({ page }) => {
    const experienceCards = page.locator("#experience article");

    await expect(experienceCards.first()).toBeVisible();

    const count = await experienceCards.count();

    for (let i = 0; i < count; i++) {
      const card = experienceCards.nth(i);

      await expect(card.locator("h3")).toBeVisible();

      await expect(card.locator("div p").first()).toBeVisible();
    }
  });

  test("each experience displays an employment period", async ({ page }) => {
    const experienceCards = page.locator("#experience article");

    await expect(experienceCards.first()).toBeVisible();

    const count = await experienceCards.count();

    for (let i = 0; i < count; i++) {
      await expect(
        experienceCards.nth(i).locator("div > p").last(),
      ).toBeVisible();
    }
  });

  test("displays the experience section introduction", async ({ page }) => {
    await expect(
      page.getByText(
        "My experience in software quality assurance, testing, and automation.",
      ),
    ).toBeVisible();
  });
});
