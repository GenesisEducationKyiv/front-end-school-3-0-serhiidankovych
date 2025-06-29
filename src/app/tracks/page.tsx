"use client";
import dynamic from 'next/dynamic';
import { AlertCircle, CopyX, Loader2, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";

import { TrackFilters } from "@/features/tracks/components/track-filters";
import { TrackList } from "@/features/tracks/components/track-list";

const AudioPlayer = dynamic(() => 
  import('@/features/tracks/components/audio-player').then(mod => mod.AudioPlayer),
);

const TrackModal = dynamic(() =>
  import('@/features/tracks/components/track-modal').then(mod => mod.TrackModal)
);
const DeleteTrackDialog = dynamic(() =>
  import('@/features/tracks/components/delete-track-dialog').then(mod => mod.DeleteTrackDialog)
);
const UploadTrackModal = dynamic(() =>
  import('@/features/tracks/components/upload-track-modal').then(mod => mod.UploadTrackModal)
);

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { Track } from "@/features/tracks/schemas/schemas";
import { ITEMS_PER_PAGE, useTracksQuery } from "@/features/tracks/hooks/use-tracks";
import { ComponentTrackFilters } from "@/features/tracks/types";
import React from "react";
import { useAudioPlayerStore } from "@/features/tracks/store/use-audio-player-store";
import ActiveTrackDisplay from "@/features/tracks/components/active-track";

const queryClient = new QueryClient({
});

function TracksPageContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<ComponentTrackFilters>({
    search: "",
    genre: "",
    artist: "",
    sort: "",
    order: "",
  });
  
  const updateFilters = (newFilters: Partial<ComponentTrackFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1); 
  };
  
  const {
    data,
    isLoading,
    isFetching, 
    error,
    refetch,
  } = useTracksQuery({ filters, currentPage });
  
  const tracks = data?.data ?? [];
  const totalTracks = data?.meta.total ?? 0;
  const totalPages = data?.meta.totalPages ?? 0;
  
  const { currentTrack, isPlaying, handlePlay, closePlayer } = useAudioPlayerStore();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTrackToEdit, setSelectedTrackToEdit] = useState<Track | null>(null);
  const [tracksToDelete, setTracksToDelete] = useState<Track[]>([]);
  const [selectedTrackToUpload, setSelectedTrackToUpload] = useState<Track | null>(null);
  const [selectedTrackIds, setSelectedTrackIds] = useState<Set<string>>(new Set());
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
  const handleDeleteTrack = (track: Track) => {
    setTracksToDelete([track]);
    setIsDeleteDialogOpen(true);
    closePlayer();
  };
  const handleTriggerMultipleDelete = () => {
    const tracksToConfirm = tracks.filter((track) => selectedTrackIds.has(track.id));
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
  const handlePageChange = (page: number) => {
      setSelectedTrackIds(new Set());
      setCurrentPage(page);
  };

  return (
    <div className="container mx-auto max-w-6xl p-4 sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold" data-testid="tracks-header">Tracks</h1>
        <div className="flex items-center gap-2">
          <Button variant={isSelectionMode ? "secondary" : "outline"} onClick={toggleSelectionMode} size="sm">
            <CopyX className="mr-2 h-4 w-4" />
            {isSelectionMode ? "Exit Selection" : "Select Tracks"}
          </Button>
          {selectedTrackIds.size > 0 && (
            <Button variant="destructive" onClick={handleTriggerMultipleDelete} size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete ({selectedTrackIds.size})
            </Button>
          )}
          <Button onClick={handleAddTrack} data-testid="create-track-button" size="sm">
            <Plus className="mr-2 h-4 w-4" /> Add Track
          </Button>
        </div>
      </div>
      <div className="mb-6">
        <TrackFilters filters={filters} updateFilters={updateFilters} />
      </div>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {isFetching ? (
            <span className="flex items-center" data-testid="loading-indicator">
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              {isLoading ? "Loading tracks..." : "Updating results..."}
            </span>
          ) : (
            <>
              {totalTracks === 0 ? "No tracks found" : `Showing ${Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalTracks)}-${Math.min(currentPage * ITEMS_PER_PAGE, totalTracks)} of ${totalTracks} track${totalTracks !== 1 ? "s" : ""}`}
            </>
          )}
        </div>
        {!isLoading && totalTracks > ITEMS_PER_PAGE && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        )}
      </div>
      {error && (
        <div className="mb-4 p-4 border rounded-md bg-destructive/10 text-destructive flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span>Error: {error.message}</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="text-xs">Retry</Button>
        </div>
      )}
      <TrackList 
        tracks={tracks} 
        isLoading={isLoading} 
        onEdit={handleEditTrack} 
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
        <div className="text-center py-12 border rounded-md bg-muted/50">
          <p className="text-lg font-medium mb-2">No Tracks Found</p>
          <p className="text-sm text-muted-foreground">
            {Object.values(filters).some(Boolean)
              ? "Try adjusting your filters to see more results."
              : "Add your first track to get started."}
          </p>
        </div>
      )}
      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background shadow-lg">
          <AudioPlayer track={currentTrack} handlePlay={handlePlay} onClose={closePlayer} isPlaying={isPlaying} />
        </div>
      )}

      <TrackModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={() => {}} mode="create" />
      <TrackModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSuccess={() => {}} track={selectedTrackToEdit} mode="edit" />
      <DeleteTrackDialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} tracksToDelete={tracksToDelete} onSuccess={() => setSelectedTrackIds(new Set())} />
      {selectedTrackToUpload && (
        <UploadTrackModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} track={selectedTrackToUpload} onSuccess={() => {}} />
      )}
      <ActiveTrackDisplay/>
    </div>
  );
}

export default function TracksPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <TracksPageContent />
    </QueryClientProvider>
  );
}