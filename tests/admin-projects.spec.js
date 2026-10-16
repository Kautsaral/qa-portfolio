import { test, expect } from "@playwright/test";

test("Admin sees validation when project title is empty", async ({ page }) => {
  const email = process.env.PLAYWRIGHT_ADMIN_EMAIL;
  const password = process.env.PLAYWRIGHT_ADMIN_PASSWORD;

  expect(email, "PLAYWRIGHT_ADMIN_EMAIL harus tersedia").toBeTruthy();
  expect(password, "PLAYWRIGHT_ADMIN_PASSWORD harus tersedia").toBeTruthy();

  await page.goto("/login");

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign In" }).click();

  // Pastikan login berhasil sebelum melanjutkan
  await expect(page).toHaveURL(/\/admin/);

  // Buka halaman pengelolaan Projects
  await page.goto("/admin/projects");

  // Tunggu halaman Projects selesai dimuat
  await expect(
    page.getByRole("button", { name: "+ Tambah Project" }),
  ).toBeVisible();

  // Buka form tambah project
  await page.getByRole("button", { name: "+ Tambah Project" }).click();

  // Pastikan field Title kosong
  const titleInput = page.getByLabel("Title *");
  await expect(titleInput).toBeVisible();
  await expect(titleInput).toHaveValue("");

  // Klik submit tanpa mengisi Title
  await page
    .getByRole("button", { name: "Simpan Project" })
    .evaluate((button) => {
      button.form.noValidate = true;
      button.form.requestSubmit();
    });

  await expect(
    page.getByText("Title wajib diisi.", { exact: true }),
  ).toBeVisible();
});

test("Admin sees validation when GitHub URL is invalid", async ({ page }) => {
  const email = process.env.PLAYWRIGHT_ADMIN_EMAIL;
  const password = process.env.PLAYWRIGHT_ADMIN_PASSWORD;

  expect(email, "PLAYWRIGHT_ADMIN_EMAIL harus tersedia").toBeTruthy();
  expect(password, "PLAYWRIGHT_ADMIN_PASSWORD harus tersedia").toBeTruthy();

  // Login sebagai admin
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/admin/);

  // Buka form tambah project
  await page.goto("/admin/projects");
  await page.getByRole("button", { name: "+ Tambah Project" }).click();

  // Isi judul dan URL yang tidak valid
  await page.getByLabel("Title *").fill("Automation Test");
  await page.getByLabel("GitHub URL").fill("bukan-url-valid");

  // Lewati validasi HTML agar validasi JavaScript aplikasi diuji
  await page
    .getByRole("button", { name: "Simpan Project" })
    .evaluate((button) => {
      button.form.noValidate = true;
      button.form.requestSubmit();
    });

  // Pastikan aplikasi menolak URL
  await expect(
    page.getByText("GitHub URL harus berupa URL yang valid (http/https).", {
      exact: true,
    }),
  ).toBeVisible();
});

test("Admin sees validation when display order is negative", async ({
  page,
}) => {
  const email = process.env.PLAYWRIGHT_ADMIN_EMAIL;
  const password = process.env.PLAYWRIGHT_ADMIN_PASSWORD;

  expect(email, "PLAYWRIGHT_ADMIN_EMAIL harus tersedia").toBeTruthy();
  expect(password, "PLAYWRIGHT_ADMIN_PASSWORD harus tersedia").toBeTruthy();

  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/admin/);

  await page.goto("/admin/projects");
  await page.getByRole("button", { name: "+ Tambah Project" }).click();

  await page.getByLabel("Title *").fill("Automation Test");
  await page.getByLabel("Display Order").fill("-1");

  await page
    .getByRole("button", { name: "Simpan Project" })
    .evaluate((button) => {
      button.form.noValidate = true;
      button.form.requestSubmit();
    });

  await expect(
    page.getByText("Display order harus berupa bilangan bulat minimal 0.", {
      exact: true,
    }),
  ).toBeVisible();
});

test("Admin can open an existing project for editing", async ({ page }) => {
  const email = process.env.PLAYWRIGHT_ADMIN_EMAIL;
  const password = process.env.PLAYWRIGHT_ADMIN_PASSWORD;

  expect(email, "PLAYWRIGHT_ADMIN_EMAIL harus tersedia").toBeTruthy();
  expect(password, "PLAYWRIGHT_ADMIN_PASSWORD harus tersedia").toBeTruthy();

  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/admin/);

  await page.goto("/admin/projects");

  const projectRow = page
    .getByRole("row")
    .filter({ hasText: "Cypress API Testing test update" });

  await expect(projectRow).toBeVisible();
  await projectRow.getByRole("button", { name: "Edit" }).click();

  await expect(
    page.getByRole("heading", { name: "Edit Project" }),
  ).toBeVisible();
  await expect(page.getByLabel("Title *")).toHaveValue(
    "Cypress API Testing test update",
  );
});

test("Admin can cancel project editing without saving", async ({ page }) => {
  const email = process.env.PLAYWRIGHT_ADMIN_EMAIL;
  const password = process.env.PLAYWRIGHT_ADMIN_PASSWORD;

  expect(email, "PLAYWRIGHT_ADMIN_EMAIL harus tersedia").toBeTruthy();
  expect(password, "PLAYWRIGHT_ADMIN_PASSWORD harus tersedia").toBeTruthy();

  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/admin/);

  await page.goto("/admin/projects");

  const projectRow = page
    .getByRole("row")
    .filter({ hasText: "Cypress API Testing test update" });

  await expect(projectRow).toBeVisible();
  await projectRow.getByRole("button", { name: "Edit" }).click();

  const titleInput = page.getByLabel("Title *");

  // Pastikan form edit terbuka
  await expect(titleInput).toHaveValue("Cypress API Testing test update");

  // Ubah nilai hanya di form, lalu batalkan
  await titleInput.fill("Judul Sementara untuk Test");
  await page.getByRole("button", { name: "Batal" }).click();

  // Pastikan form tertutup dan perubahan tidak disimpan
  await expect(page.getByRole("heading", { name: "Edit Project" })).toHaveCount(
    0,
  );
  await expect(titleInput).toHaveCount(0);
  await expect(projectRow).toContainText("Cypress API Testing test update");
});
