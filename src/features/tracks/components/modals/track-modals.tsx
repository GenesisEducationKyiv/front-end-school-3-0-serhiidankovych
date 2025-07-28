"use client";
import dynamic from "next/dynamic";

import { Track } from "@/features/tracks/schemas/schemas";

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

interface TracksModalsProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;

  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
  selectedTrackToEdit: Track | null;

  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  tracksToDelete: Track[];
  setSelectedTrackIds: (ids: Set<string>) => void;

  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;
  selectedTrackToUpload: Track | null;
}

export function TracksModals({
  isAddModalOpen,
  setIsAddModalOpen,
  isEditModalOpen,
  setIsEditModalOpen,
  selectedTrackToEdit,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  tracksToDelete,
  setSelectedTrackIds,
  isUploadModalOpen,
  setIsUploadModalOpen,
  selectedTrackToUpload,
}: TracksModalsProps) {
  return (
    <>
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
    </>
  );
}
