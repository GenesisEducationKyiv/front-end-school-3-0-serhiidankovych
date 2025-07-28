"use client";
import { useRouter } from "next/navigation";

import { Track } from "@/features/tracks/schemas/schemas";
import { useAudioPlayerStore } from "@/features/tracks/store/use-audio-player-store";
import {
  ComponentTrackFilters,
  TrackOrder,
  TrackSort,
} from "@/features/tracks/types";

interface UseTracksPageActionsProps {
  filters: ComponentTrackFilters;
  setFilters: (filters: ComponentTrackFilters) => void;
  setCurrentPage: (page: number) => void;
  setSelectedTrackIds: (ids: Set<string>) => void;
  setSelectedTrackToEdit: (track: Track | null) => void;
  setIsEditModalOpen: (open: boolean) => void;
  setSelectedTrackToUpload: (track: Track | null) => void;
  setIsUploadModalOpen: (open: boolean) => void;
  setTracksToDelete: (tracks: Track[]) => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
  setIsAddModalOpen: (open: boolean) => void;
}
export function useTracksPageActions({
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
}: UseTracksPageActionsProps) {
  const router = useRouter();
  const { closePlayer } = useAudioPlayerStore();

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

  const handleTriggerMultipleDelete = (
    tracks: Track[],
    selectedTrackIds: Set<string>
  ) => {
    const tracksToConfirm = tracks.filter((track) =>
      selectedTrackIds.has(track.id)
    );
    if (tracksToConfirm.length > 0) {
      setTracksToDelete(tracksToConfirm);
      setIsDeleteDialogOpen(true);
      closePlayer();
    }
  };

  return {
    updateFilters,
    handlePageChange,
    handleAddTrack,
    handleUploadTrack,
    handleEditTrack,
    handleOpenTrack,
    handleDeleteTrack,
    handleTriggerMultipleDelete,
  };
}
