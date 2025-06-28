import { test, expect } from "@playwright/test";

const APP_URL = "http://localhost:3000";

test.describe("Clear Filters E2E Test", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/genres", (route) => {
      route.fulfill({
        status: 200,
        json: ["Electronic", "Ambient", "Chillwave", "Jazz", "Rock"],
      });
    });

    await page.route("**/api/artists", (route) => {
      route.fulfill({
        status: 200,
        json: [
          "Artist One",
          "Artist Two",
          "Artist Three",
          "Jazz Master",
          "Rock Star",
        ],
      });
    });

    await page.route("**/api/tracks**", (route) => {
      if (route.request().method() === "GET") {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          json: {
            data: [
              {
                id: "1",
                title: "Test Track 1",
                artist: "Artist One",
                album: "Test Album",
                genre: "Electronic",
                createdAt: "2024-01-01T00:00:00Z",
              },
              {
                id: "2",
                title: "Another Track",
                artist: "Artist Two",
                album: "Another Album",
                genre: "Ambient",
                createdAt: "2024-01-02T00:00:00Z",
              },
            ],
            meta: { total: 2, page: 1, limit: 10, totalPages: 1 },
          },
        });
      }
    });
  });

  test("should not show clear filters button on initial load", async ({ page }) => {
    await page.goto(`${APP_URL}/tracks`);
    await expect(page.getByTestId("clear-filters")).not.toBeVisible();
  });

  test("should not show clear filters button after clearing search input", async ({ page }) => {
    await page.goto(`${APP_URL}/tracks`);

    const searchInput = page.getByPlaceholder(
      "Search by title, artist, or album..."
    );
    await searchInput.fill("test");
    await expect(page.getByTestId("clear-filters")).toBeVisible();

    await page.getByTestId("clear-filters").click();
    await expect(searchInput).toHaveValue("");
  });

  test("should not show clear filters button after clearing dropdown", async ({ page }) => {
    await page.goto(`${APP_URL}/tracks`);

    await page.waitForFunction(() => {
      const selects = document.querySelectorAll('[role="combobox"]');
      return selects.length >= 3 && !selects[0].hasAttribute("data-disabled");
    });

    const genreSelect = page.locator('[role="combobox"]').first();
    await genreSelect.click();
    await page.getByRole("option", { name: "Electronic" }).click();
    await expect(page.getByTestId("clear-filters")).toBeVisible();

    await page.getByTestId("clear-filters").click();
    await expect(genreSelect).toContainText("All");
  });
});
