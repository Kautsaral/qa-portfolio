import { test, expect } from "@playwright/test";

const adminEmail = process.env.PLAYWRIGHT_ADMIN_EMAIL;
const adminPassword = process.env.PLAYWRIGHT_ADMIN_PASSWORD;

test.describe("Authentication & Security", () => {
  test("unauthenticated user is redirected to login", async ({ page }) => {
    await page.goto("/admin");

    await expect(page).toHaveURL(/\/login/);
    await expect(
      page.getByRole("heading", { name: "Admin Login" }),
    ).toBeVisible();
  });

  test("login with invalid credentials is rejected", async ({ page }) => {
    await page.goto("/login");

    await page.locator("#email").fill("invalid-user@example.com");
    await page.locator("#password").fill("InvalidPassword123!");
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(
      page.getByText("Email atau password tidak valid.", {
        exact: true,
      }),
    ).toBeVisible();

    await expect(page).toHaveURL(/\/login/);
  });

  test("admin can log in and access dashboard", async ({ page }) => {
    test.skip(!adminEmail || !adminPassword);

    await page.goto("/login");
    await page.locator("#email").fill(adminEmail);
    await page.locator("#password").fill(adminPassword);
    await page.getByRole("button", { name: "Sign In" }).click();

    await page.waitForTimeout(1500);

    console.log("URL setelah login:", page.url());

    const errorMessage = page.getByText("Email atau password tidak valid.", {
      exact: true,
    });

    if (await errorMessage.isVisible().catch(() => false)) {
      console.log("Login ditolak: email atau password tidak valid.");
    }

    await expect(page).toHaveURL(/\/admin(?:\/)?$/);
  });

  test("admin can log out and cannot access dashboard afterward", async ({
    page,
  }) => {
    test.skip(!adminEmail || !adminPassword);

    await page.goto("/login");
    await page.locator("#email").fill(adminEmail);
    await page.locator("#password").fill(adminPassword);
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page).toHaveURL(/\/admin(?:\/)?$/);

    const logoutControl = page
      .getByRole("button", { name: /log\s*out|sign\s*out/i })
      .or(page.getByRole("link", { name: /log\s*out|sign\s*out/i }));

    await expect(logoutControl).toBeVisible();
    await logoutControl.click();

    await expect(page).toHaveURL(/\/login/);

    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
  });
});
