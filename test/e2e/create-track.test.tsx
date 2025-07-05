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

 
});
