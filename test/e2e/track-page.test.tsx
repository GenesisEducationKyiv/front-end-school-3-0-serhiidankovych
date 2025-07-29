import { test, expect } from "@playwright/test";

const APP_URL = "http://localhost:3000";

const mockTracks = [
  {
    id: "1",
    title: "Synth Dreams",
    artist: "Vangelis 2.0",
    genres: ["Electronic", "Ambient"],
    slug: "synth-dreams",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Oceanic Flow",
    artist: "Deep Dive",
    genres: ["Ambient"],
    slug: "oceanic-flow",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

test.describe("Tracks Page E2E Tests", () => {
  test("should load the page and display a list of tracks", async ({
    page,
  }) => {
    await page.route("**/api/tracks**", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        json: {
          data: mockTracks,
          meta: { total: mockTracks.length, page: 1, limit: 10, totalPages: 1 },
        },
      });
    });

    await page.route("**/api/genres", (route) => {
      route.fulfill({ json: ["Electronic", "Ambient"] });
    });

    await page.goto(`${APP_URL}/tracks`);

    await expect(page.getByRole("heading", { name: "Tracks" })).toBeVisible();

    await expect(page.getByText("Synth Dreams")).toBeVisible();
    await expect(page.getByText("Vangelis 2.0")).toBeVisible();
    await expect(page.getByText("Oceanic Flow")).toBeVisible();
    await expect(page.getByText("Deep Dive")).toBeVisible();

    await expect(page.getByText(`Showing 1-2 of 2 tracks`)).toBeVisible();
  });
});
