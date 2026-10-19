import { test, expect } from "@playwright/test";

async function loginAsAdmin(page) {
  const email = process.env.PLAYWRIGHT_ADMIN_EMAIL;
  const password = process.env.PLAYWRIGHT_ADMIN_PASSWORD;

  expect(email, "PLAYWRIGHT_ADMIN_EMAIL harus tersedia").toBeTruthy();
  expect(password, "PLAYWRIGHT_ADMIN_PASSWORD harus tersedia").toBeTruthy();

  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);

  // Catat respons request autentikasi tanpa mencatat kredensial.
  const authResponsePromise = page
    .waitForResponse(
      (response) =>
        response.url().includes("/auth/v1/token") &&
        response.request().method() === "POST",
      { timeout: 15000 },
    )
    .catch(() => null);

  await page.getByRole("button", { name: "Sign In" }).click();

  const authResponse = await authResponsePromise;

  if (authResponse) {
    console.log("Auth HTTP status:", authResponse.status());

    if (!authResponse.ok()) {
      console.log("Auth response:", (await authResponse.text()).slice(0, 500));
    }
  } else {
    console.log("Auth response tidak tertangkap.");
  }

  try {
    await expect(page).toHaveURL(/\/admin(?:\/|$|\?)/, {
      timeout: 10000,
    });
  } catch (error) {
    const invalidCredentials = page.getByText(
      "Email atau password tidak valid.",
      { exact: true },
    );

    const generalError = page.getByText(
      "Terjadi kesalahan. Silakan coba lagi.",
      { exact: true },
    );

    if (await invalidCredentials.isVisible().catch(() => false)) {
      console.log("Login error: kredensial ditolak.");
    }

    if (await generalError.isVisible().catch(() => false)) {
      console.log("Login error: terjadi kesalahan aplikasi.");
    }

    console.log("URL akhir login:", page.url());
    throw error;
  }
}

async function openAddProjectForm(page) {
  await page.goto("/admin/projects");

  const addButton = page.getByRole("button", {
    name: "+ Tambah Project",
  });

  await expect(addButton).toBeVisible();
  await addButton.click();

  await expect(page.getByLabel("Title *")).toBeVisible();
}

async function submitProjectForm(page) {
  await page
    .getByRole("button", { name: "Simpan Project" })
    .evaluate((button) => {
      button.form.noValidate = true;
      button.form.requestSubmit();
    });
}

async function openExistingProject(page) {
  const projectRow = page
    .getByRole("row")
    .filter({ hasText: "Cypress API Testing test update" });

  await expect(projectRow).toBeVisible();
  await projectRow.getByRole("button", { name: "Edit" }).click();

  await expect(
    page.getByRole("heading", { name: "Edit Project" }),
  ).toBeVisible();

  return projectRow;
}

test("Admin sees validation when project title is empty", async ({ page }) => {
  await loginAsAdmin(page);
  await openAddProjectForm(page);

  await expect(page.getByLabel("Title *")).toHaveValue("");
  await submitProjectForm(page);

  await expect(
    page.getByText("Title wajib diisi.", { exact: true }),
  ).toBeVisible();
});

test("Admin sees validation when GitHub URL is invalid", async ({ page }) => {
  await loginAsAdmin(page);
  await openAddProjectForm(page);

  await page.getByLabel("Title *").fill("Automation Test");
  await page.getByLabel("GitHub URL").fill("bukan-url-valid");
  await submitProjectForm(page);

  await expect(
    page.getByText("GitHub URL harus berupa URL yang valid (http/https).", {
      exact: true,
    }),
  ).toBeVisible();
});

test("Admin sees validation when display order is negative", async ({
  page,
}) => {
  await loginAsAdmin(page);
  await openAddProjectForm(page);

  await page.getByLabel("Title *").fill("Automation Test");
  await page.getByLabel("Display Order").fill("-1");
  await submitProjectForm(page);

  await expect(
    page.getByText("Display order harus berupa bilangan bulat minimal 0.", {
      exact: true,
    }),
  ).toBeVisible();
});

test("Admin can open an existing project for editing", async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto("/admin/projects");

  const projectRow = await openExistingProject(page);

  await expect(page.getByLabel("Title *")).toHaveValue(
    "Cypress API Testing test update",
  );
  await expect(projectRow).toBeVisible();
});

test("Admin can cancel project editing without saving", async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto("/admin/projects");

  const projectRow = await openExistingProject(page);
  const titleInput = page.getByLabel("Title *");

  await expect(titleInput).toHaveValue("Cypress API Testing test update");

  await titleInput.fill("Judul Sementara untuk Test");
  await page.getByRole("button", { name: "Batal" }).click();

  await expect(page.getByRole("heading", { name: "Edit Project" })).toHaveCount(
    0,
  );

  await expect(titleInput).toHaveCount(0);
  await expect(projectRow).toContainText("Cypress API Testing test update");
});
