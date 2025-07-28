"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { TracksModals } from "@/features/tracks/components/modals/track-modals";
import { TrackFilters } from "@/features/tracks/components/ui/track-filters";
import { TrackList } from "@/features/tracks/components/ui/track-list";
import { TracksErrorBanner } from "@/features/tracks/components/ui/tracks-empty-banner";
import { TracksEmptyState } from "@/features/tracks/components/ui/tracks-emty-state";
import { TracksPageHeader } from "@/features/tracks/components/ui/tracks-page-header";
import { TracksStatusBar } from "@/features/tracks/components/ui/tracks-status-bar";
import { useTracksQuery } from "@/features/tracks/hooks/use-tracks";
import { useTracksPageActions } from "@/features/tracks/hooks/use-tracks-page-actions";
import { useTracksPageState } from "@/features/tracks/hooks/use-tracks-page-state";
import { useAudioPlayerStore } from "@/features/tracks/store/use-audio-player-store";
import {
  ComponentTrackFilters,
  TrackOrder,
  TrackSort,
} from "@/features/tracks/types";

interface TracksPageContentProps {
  initialPage: number;
  initialFilters: ComponentTrackFilters;
}

export function TracksPageContent({
  initialPage,
  initialFilters,
}: TracksPageContentProps) {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(initialPage);

  const {
    filters,
    setFilters,
    selectedTrackIds,
    setSelectedTrackIds,
    isSelectionMode,
    isAddModalOpen,
    setIsAddModalOpen,
    isUploadModalOpen,
    setIsUploadModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedTrackToEdit,
    setSelectedTrackToEdit,
    tracksToDelete,
    setTracksToDelete,
    selectedTrackToUpload,
    setSelectedTrackToUpload,
    toggleSelectionMode,
    handleSelectionChange,
    handleSelectAllChange,
  } = useTracksPageState(initialFilters);

  const {
    updateFilters,
    handlePageChange,
    handleAddTrack,
    handleUploadTrack,
    handleEditTrack,
    handleOpenTrack,
    handleDeleteTrack,
    handleTriggerMultipleDelete,
  } = useTracksPageActions({
    filters,
    setFilters,
    setCurrentPage,
    setSelectedTrackIds,
    setSelectedTrackToEdit,
    setIsEditModalOpen,
    setSelectedTrackToUpload,
    setIsUploadModalOpen,
    setTracksToDelete,
    setIsDeleteDialogOpen,
    setIsAddModalOpen,
  });

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
  }, [searchParams, setFilters]);

  const { data, isLoading, isFetching, error, refetch } = useTracksQuery({
    filters,
    currentPage,
  });

  const tracks = data?.data ?? [];
  const totalTracks = data?.meta.total ?? 0;
  const totalPages = data?.meta.totalPages ?? 0;

  const { currentTrack, isPlaying, handlePlay } = useAudioPlayerStore();

  const visibleTrackIds = useMemo(() => tracks.map((t) => t.id), [tracks]);

  return (
    <div className="container mx-auto max-w-6xl p-4 sm:p-8 min-h-screen">
      <TracksPageHeader
        isSelectionMode={isSelectionMode}
        selectedTrackIds={selectedTrackIds}
        onToggleSelectionMode={toggleSelectionMode}
        onMultipleDelete={() =>
          handleTriggerMultipleDelete(tracks, selectedTrackIds)
        }
        onAddTrack={handleAddTrack}
      />

      <div className="mb-6">
        <TrackFilters filters={filters} updateFilters={updateFilters} />
      </div>

      <TracksStatusBar
        isLoading={isLoading}
        isFetching={isFetching}
        totalTracks={totalTracks}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <TracksErrorBanner error={error} onRetry={refetch} />

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
        onSelectAllChange={(isSelected) =>
          handleSelectAllChange(isSelected, visibleTrackIds)
        }
        isSelectionMode={isSelectionMode}
      />

      {!isLoading && tracks.length === 0 && !error && (
        <TracksEmptyState filters={filters} />
      )}

      <TracksModals
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        selectedTrackToEdit={selectedTrackToEdit}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        tracksToDelete={tracksToDelete}
        setSelectedTrackIds={setSelectedTrackIds}
        isUploadModalOpen={isUploadModalOpen}
        setIsUploadModalOpen={setIsUploadModalOpen}
        selectedTrackToUpload={selectedTrackToUpload}
      />
    </div>
  );
}
