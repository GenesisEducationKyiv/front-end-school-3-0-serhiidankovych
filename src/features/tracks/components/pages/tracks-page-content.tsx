"use client";
import { AlertCircle, CopyX, Loader2, Plus, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { TrackFilters } from "@/features/tracks/components/ui/track-filters";
import { TrackList } from "@/features/tracks/components/ui/track-list";
import {
  ITEMS_PER_PAGE,
  useTracksQuery,
} from "@/features/tracks/hooks/use-tracks";
import { Track } from "@/features/tracks/schemas/schemas";
import { useAudioPlayerStore } from "@/features/tracks/store/use-audio-player-store";
import {
  ComponentTrackFilters,
  TrackOrder,
  TrackSort,
} from "@/features/tracks/types";

const TrackModal = dynamic(() =>
  import("@/features/tracks/components/modals/track-modal").then(
    (mod) => mod.TrackModal
  )
);

const DeleteTrackDialog = dynamic(() =>
  import("@/features/tracks/components/modals/delete-track-dialog").then(
    (mod) => mod.DeleteTrackDialog
  )
);

const UploadTrackModal = dynamic(() =>
  import("@/features/tracks/components/modals/upload-track-modal").then(
    (mod) => mod.UploadTrackModal
  )
);

interface TracksPageContentProps {
  initialPage: number;
  initialFilters: ComponentTrackFilters;
}

export function TracksPageContent({
  initialPage,
  initialFilters,
}: TracksPageContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [filters, setFilters] = useState<ComponentTrackFilters>(initialFilters);

  const updateURL = (newFilters: ComponentTrackFilters, newPage: number) => {
    const params = new URLSearchParams();

    if (newPage > 1) params.set("page", newPage.toString());
    if (newFilters.search) params.set("search", newFilters.search);
    if (newFilters.genre) params.set("genre", newFilters.genre);
    if (newFilters.artist) params.set("artist", newFilters.artist);
    if (newFilters.sort) params.set("sort", newFilters.sort);
    if (newFilters.order) params.set("order", newFilters.order);

    const url = params.toString() ? `/tracks?${params.toString()}` : "/tracks";
    router.push(url, { scroll: false });
  };

  const updateFilters = (newFilters: Partial<ComponentTrackFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setCurrentPage(1);
    updateURL(updatedFilters, 1);
  };

  const handlePageChange = (page: number) => {
    setSelectedTrackIds(new Set());
    setCurrentPage(page);
    updateURL(filters, page);
  };

  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    const urlFilters: ComponentTrackFilters = {
      search: searchParams.get("search") || "",
      genre: searchParams.get("genre") || "",
      artist: searchParams.get("artist") || "",
      sort: (searchParams.get("sort") as TrackSort) || "",
      order: (searchParams.get("order") as TrackOrder) || "",
    };

    setCurrentPage(page);
    setFilters(urlFilters);
  }, [searchParams]);

  const { data, isLoading, isFetching, error, refetch } = useTracksQuery({
    filters,
    currentPage,
  });

  const tracks = data?.data ?? [];
  const totalTracks = data?.meta.total ?? 0;
  const totalPages = data?.meta.totalPages ?? 0;

  const { currentTrack, isPlaying, handlePlay, closePlayer } =
    useAudioPlayerStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTrackToEdit, setSelectedTrackToEdit] = useState<Track | null>(
    null
  );
  const [tracksToDelete, setTracksToDelete] = useState<Track[]>([]);
  const [selectedTrackToUpload, setSelectedTrackToUpload] =
    useState<Track | null>(null);
  const [selectedTrackIds, setSelectedTrackIds] = useState<Set<string>>(
    new Set()
  );
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const visibleTrackIds = useMemo(() => tracks.map((t) => t.id), [tracks]);

  const handleAddTrack = () => setIsAddModalOpen(true);
  const handleUploadTrack = (track: Track) => {
    setSelectedTrackToUpload(track);
    setIsUploadModalOpen(true);
    closePlayer();
  };
  const handleEditTrack = (track: Track) => {
    setSelectedTrackToEdit(track);
    setIsEditModalOpen(true);
    closePlayer();
  };
  const handleOpenTrack = (trackId: string) => {
    router.push(`/tracks/${trackId}`);
  };

  const handleDeleteTrack = (track: Track) => {
    setTracksToDelete([track]);
    setIsDeleteDialogOpen(true);
    closePlayer();
  };
  const handleTriggerMultipleDelete = () => {
    const tracksToConfirm = tracks.filter((track) =>
      selectedTrackIds.has(track.id)
    );
    if (tracksToConfirm.length > 0) {
      setTracksToDelete(tracksToConfirm);
      setIsDeleteDialogOpen(true);
      closePlayer();
    }
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) setSelectedTrackIds(new Set());
  };
  const handleSelectionChange = (trackId: string, isSelected: boolean) => {
    setSelectedTrackIds((prev) => {
      const newSelectedIds = new Set(prev);
      isSelected ? newSelectedIds.add(trackId) : newSelectedIds.delete(trackId);
      return newSelectedIds;
    });
  };
  const handleSelectAllChange = (isSelected: boolean) => {
    setSelectedTrackIds(isSelected ? new Set(visibleTrackIds) : new Set());
  };

  return (
    <div className="container mx-auto max-w-6xl p-4 sm:p-8 min-h-screen">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold" data-testid="tracks-header">
          Tracks
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant={isSelectionMode ? "secondary" : "outline"}
            onClick={toggleSelectionMode}
            size="sm"
          >
            <CopyX className="mr-2 h-4 w-4" />
            {isSelectionMode ? "Exit Selection" : "Select Tracks"}
          </Button>
          {selectedTrackIds.size > 0 && (
            <Button
              variant="destructive"
              onClick={handleTriggerMultipleDelete}
              size="sm"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete ({selectedTrackIds.size})
            </Button>
          )}
          <Button
            onClick={handleAddTrack}
            data-testid="create-track-button"
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Track
          </Button>
        </div>
      </div>
      <div className="mb-6">
        <TrackFilters filters={filters} updateFilters={updateFilters} />
      </div>

      <div className="mb-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        {isLoading ? (
          <>
            <Skeleton className="h-5 w-[250px]" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
            </div>
          </>
        ) : (
          <>
            <div className="flex min-h-5 items-center text-sm text-muted-foreground">
              {isFetching ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  <span>Updating results...</span>
                </span>
              ) : (
                <span>
                  {totalTracks === 0
                    ? "No tracks found"
                    : `Showing ${Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalTracks)}-${Math.min(currentPage * ITEMS_PER_PAGE, totalTracks)} of ${totalTracks} track${totalTracks !== 1 ? "s" : ""}`}
                </span>
              )}
            </div>
            {totalTracks > ITEMS_PER_PAGE && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>

      {error && (
        <div className="mb-4 flex items-center justify-between rounded-md border bg-destructive/10 p-4 text-destructive">
          <div className="flex items-center">
            <AlertCircle className="mr-2 h-4 w-4" />
            <span>Error: {error.message}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="text-xs"
          >
            Retry
          </Button>
        </div>
      )}
      <TrackList
        tracks={tracks}
        isLoading={isLoading}
        onEdit={handleEditTrack}
        onOpen={handleOpenTrack}
        onDelete={handleDeleteTrack}
        onUpload={handleUploadTrack}
        onPlay={handlePlay}
        currentTrackId={currentTrack?.id}
        isPlaying={isPlaying}
        selectedTrackIds={selectedTrackIds}
        onSelectionChange={handleSelectionChange}
        onSelectAllChange={handleSelectAllChange}
        isSelectionMode={isSelectionMode}
      />
      {!isLoading && tracks.length === 0 && !error && (
        <div className="rounded-md border bg-muted/50 py-12 text-center">
          <p className="mb-2 text-lg font-medium">No Tracks Found</p>
          <p className="text-sm text-muted-foreground">
            {Object.values(filters).some(Boolean)
              ? "Try adjusting your filters to see more results."
              : "Add your first track to get started."}
          </p>
        </div>
      )}

      <TrackModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {}}
        mode="create"
      />
      <TrackModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => {}}
        track={selectedTrackToEdit}
        mode="edit"
      />
      <DeleteTrackDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        tracksToDelete={tracksToDelete}
        onSuccess={() => setSelectedTrackIds(new Set())}
      />
      {selectedTrackToUpload && (
        <UploadTrackModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          track={selectedTrackToUpload}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
}
