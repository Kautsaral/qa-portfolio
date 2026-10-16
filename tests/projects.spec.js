import { test, expect } from "@playwright/test";

test.describe("Projects Section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#projects");
  });

  test("displays the Projects section heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", {
        name: "Practical testing. Measurable confidence.",
      }),
    ).toBeVisible();
  });

  test("displays published projects after loading", async ({ page }) => {
    await expect(page.getByText("Loading projects...")).not.toBeVisible();

    const projectCards = page.locator("#projects article");

    await expect(projectCards.first()).toBeVisible();
    await expect(projectCards).not.toHaveCount(0);
  });

  test("each project displays a title and description", async ({ page }) => {
    const projectCards = page.locator("#projects article");

    await expect(projectCards.first()).toBeVisible();

    const count = await projectCards.count();

    for (let i = 0; i < count; i++) {
      const card = projectCards.nth(i);

      await expect(card.locator("h3")).toBeVisible();

      await expect(card.locator("p").first()).toBeVisible();

      await expect(
        card.getByText(/Cypress|Playwright|Postman|JavaScript/i).first(),
      ).toBeVisible();
    }
  });

  test("repository links open in a new tab", async ({ page }) => {
    const repositoryLinks = page
      .locator("#projects article")
      .getByRole("link", { name: "View Repository" });

    const count = await repositoryLinks.count();

    test.skip(count === 0, "No published project has a repository link.");

    for (let i = 0; i < count; i++) {
      await expect(repositoryLinks.nth(i)).toHaveAttribute("target", "_blank");

      await expect(repositoryLinks.nth(i)).toHaveAttribute(
        "href",
        /^https?:\/\//,
      );
    }
  });

  test("live demo links open in a new tab when available", async ({ page }) => {
    const liveDemoLinks = page
      .locator("#projects article")
      .getByRole("link", { name: "Live Demo" });

    const count = await liveDemoLinks.count();

    test.skip(count === 0, "No published project has a live demo link.");

    for (let i = 0; i < count; i++) {
      await expect(liveDemoLinks.nth(i)).toHaveAttribute("target", "_blank");

      await expect(liveDemoLinks.nth(i)).toHaveAttribute(
        "href",
        /^https?:\/\//,
      );
    }
  });
});
