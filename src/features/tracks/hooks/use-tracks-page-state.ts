"use client";
import { useState } from "react";

import { Track } from "@/features/tracks/schemas/schemas";
import { ComponentTrackFilters } from "@/features/tracks/types";

export function useTracksPageState(initialFilters: ComponentTrackFilters) {
  const [filters, setFilters] = useState<ComponentTrackFilters>(initialFilters);
  const [selectedTrackIds, setSelectedTrackIds] = useState<Set<string>>(
    new Set()
  );
  const [isSelectionMode, setIsSelectionMode] = useState(false);

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

  const handleSelectAllChange = (
    isSelected: boolean,
    visibleTrackIds: string[]
  ) => {
    setSelectedTrackIds(isSelected ? new Set(visibleTrackIds) : new Set());
  };

  return {
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
  };
}
