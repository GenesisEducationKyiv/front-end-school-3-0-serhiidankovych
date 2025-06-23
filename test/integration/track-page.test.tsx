import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { R } from "@mobily/ts-belt";

import { PaginatedTrackResponse } from "@/features/tracks/schemas/schemas";
import { api, ApiError } from "@/features/tracks/api/api";
import TracksPage from "@/app/tracks/page";

vi.mock("@/features/tracks/api/api");

const mockedApi = vi.mocked(api);

const mockTracksResponse: PaginatedTrackResponse = {
  data: [
    {
      id: "1",
      title: "Test Track 1",
      artist: "Test Artist",
      genres: ["Pop"],
      slug: "test-track-1",
      coverImage: "",
      audioFile: "",
      createdAt: "",
      updatedAt: "",
    },
  ],
  meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
};

describe("TracksPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    mockedApi.getArtists.mockResolvedValue(
      R.Ok(["Test Artist", "Another Artist"])
    );
    mockedApi.getGenres.mockResolvedValue(R.Ok(["Pop", "Rock", "Ambient"]));
  });

  it("should show a loading state and then display tracks successfully", async () => {
    mockedApi.getTracks.mockResolvedValue(R.Ok(mockTracksResponse));

    render(<TracksPage />);

    expect(screen.getByText(/loading tracks/i)).toBeInTheDocument();

    await screen.findByText("Test Track 1");

    expect(screen.getByText("Test Track 1")).toBeInTheDocument();
    expect(screen.getByText("Test Artist")).toBeInTheDocument();
    expect(screen.queryByText(/loading tracks/i)).not.toBeInTheDocument();
  });

  it("should show an error message if the API call fails", async () => {
    const mockError: ApiError = {
      error: "API Error",
      message: "Failed to fetch",
    };
    mockedApi.getTracks.mockResolvedValue(R.Error(mockError));

    render(<TracksPage />);

    await screen.findByText(/error loading tracks/i);

    expect(screen.getByText(/error loading tracks/i)).toBeInTheDocument();
    expect(screen.queryByText("Test Track 1")).not.toBeInTheDocument();
  });
});
