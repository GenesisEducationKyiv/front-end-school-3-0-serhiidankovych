import { test, expect } from "@playwright/test";

const APP_URL = "http://localhost:3000";

test.describe("Create Track Button E2E Test", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/genres", (route) => {
      route.fulfill({
        status: 200,
        json: ["Electronic", "Ambient", "Chillwave"],
      });
    });

    await page.route("**/api/tracks**", (route) => {
      if (route.request().method() === "GET") {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          json: {
            data: [],
            meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
          },
        });
      }
    });
  });

  test("should open Add Track modal when create-track-button is clicked", async ({
    page,
  }) => {
    await page.goto(`${APP_URL}/tracks`);

    const createButton = page.getByTestId("create-track-button");
    await expect(createButton).toBeVisible();
    await expect(createButton).toHaveText("Add Track");

    await createButton.click();

    await expect(
      page.getByRole("heading", { name: "Create New Track" })
    ).toBeVisible();

    await expect(page.getByLabel("Title")).toBeVisible();
    await expect(page.getByLabel("Artist")).toBeVisible();
    await expect(page.getByLabel("Album")).toBeVisible();

    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(
      page.getByRole("heading", { name: "Create New Track" })
    ).not.toBeVisible();
  });
});
