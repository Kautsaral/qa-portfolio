import { test, expect } from "@playwright/test";

test.describe("Skills Section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#skills");
  });

  test("displays the Skills section heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", {
        name: "Tools and skills I work with.",
      }),
    ).toBeVisible();
  });

  test("displays published skills after loading", async ({ page }) => {
    await expect(page.getByText("Loading skills...")).not.toBeVisible();

    const skillCategories = page.locator("#skills article");

    await expect(skillCategories.first()).toBeVisible();
    await expect(skillCategories).not.toHaveCount(0);
  });

  test("each skill category displays a heading and skills", async ({
    page,
  }) => {
    const categories = page.locator("#skills article");

    await expect(categories.first()).toBeVisible();

    const count = await categories.count();

    for (let i = 0; i < count; i++) {
      const category = categories.nth(i);

      await expect(category.locator("h3")).toBeVisible();

      const skills = category.locator("div span");

      await expect(skills.first()).toBeVisible();
      await expect(skills).not.toHaveCount(0);
    }
  });

  test("displays the skills section introduction", async ({ page }) => {
    await expect(
      page.getByText(
        "Technologies and testing practices I use to help deliver reliable software.",
      ),
    ).toBeVisible();
  });
});
