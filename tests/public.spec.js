import { test, expect } from "@playwright/test";

test.describe("Public Portfolio", () => {
  test("homepage displays the main hero content", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        name: /Building quality into/i,
      }),
    ).toBeVisible();

    await expect(
      page.getByText("QA Engineer", { exact: true }).first(),
    ).toBeVisible();
  });

  test("navbar displays the main navigation links", async ({ page }) => {
    await page.goto("/");

    const navbar = page.getByRole("navigation", {
      name: "Main navigation",
    });

    await expect(navbar.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(navbar.getByRole("link", { name: "Skills" })).toBeVisible();
    await expect(
      navbar.getByRole("link", { name: "Experience" }),
    ).toBeVisible();
    await expect(navbar.getByRole("link", { name: "Projects" })).toBeVisible();
  });

  test("navbar navigates to the Projects section", async ({ page }) => {
    await page.goto("/");

    const navbar = page.getByRole("navigation", {
      name: "Main navigation",
    });

    await navbar.getByRole("link", { name: "Projects" }).click();

    await expect(page).toHaveURL(/#projects$/);
    await expect(
      page.getByRole("heading", {
        name: "Practical testing. Measurable confidence.",
      }),
    ).toBeVisible();
  });

  test("contact section is available", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("#contact")).toBeAttached();
    await expect(
      page.getByRole("heading", {
        name: "Let's make software more reliable.",
      }),
    ).toBeVisible();
  });
});
