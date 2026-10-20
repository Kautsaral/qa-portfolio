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
    const projectCards = page.locator("#projects article");

    await expect(projectCards.first()).toBeVisible();
    await expect(projectCards).not.toHaveCount(0);
    await expect(page.getByText("Loading projects...")).not.toBeVisible();
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
    const projectCards = page.locator("#projects article");

    await expect(projectCards.first()).toBeVisible();

    const repositoryLinks = page
      .locator("#projects article")
      .getByRole("link", { name: "View Repository", exact: true });

    await expect(repositoryLinks).not.toHaveCount(0);

    const count = await repositoryLinks.count();

    for (let i = 0; i < count; i++) {
      const link = repositoryLinks.nth(i);

      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("href", /^https?:\/\//);
    }
  });

  test("live demo links open in a new tab when available", async ({ page }) => {
    // Pasang mock sebelum halaman dibuka agar request asli tidak ikut digunakan.
    await page.route("**/rest/v1/projects**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 999,
            title: "Playwright Live Demo Test",
            description: "Test project for Live Demo link validation.",
            tech_stack: ["Playwright", "JavaScript"],
            github_url: "https://github.com/example/project",
            live_url: "https://example.com/demo",
            display_order: 1,
            is_published: true,
          },
        ]),
      });
    });

    await page.goto("/#projects");

    const projectCards = page.locator("#projects article");

    await expect(projectCards).toHaveCount(1);

    const projectCard = projectCards.first();

    await expect(
      projectCard.getByRole("heading", {
        name: "Playwright Live Demo Test",
      }),
    ).toBeVisible();

    const liveDemoLink = projectCard.getByRole("link", {
      name: "Live Demo",
      exact: true,
    });

    await expect(liveDemoLink).toHaveCount(1);
    await expect(liveDemoLink).toHaveAttribute("target", "_blank");
    await expect(liveDemoLink).toHaveAttribute(
      "href",
      "https://example.com/demo",
    );
  });
});
