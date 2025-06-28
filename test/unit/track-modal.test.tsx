import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { TrackModal } from "@/features/tracks/components/track-modal";

const mockOnClose = vi.fn();
const mockOnSuccess = vi.fn();

const exampleTrack = {
  id: "1",
  title: "Test Track",
  artist: "Artist",
  album: "Album",
  genres: [],
  coverImage: "",
  slug: "test-track",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("TrackModal Blackbox Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders create modal and closes on cancel", () => {
    render(
      <TrackModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        mode="create"
      />
    );

    expect(screen.getByText("Create New Track")).toBeInTheDocument();

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("renders edit modal with track data", () => {
    render(
      <TrackModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        mode="edit"
        track={exampleTrack}
      />
    );

    expect(screen.getByText("Edit Track Details")).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(exampleTrack.title))
    ).toBeInTheDocument();
  });
});
