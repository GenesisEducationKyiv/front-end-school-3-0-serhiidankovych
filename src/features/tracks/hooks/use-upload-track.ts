import { O } from "@mobily/ts-belt";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { api } from "@/features/tracks/api";
import { Track } from "@/features/tracks/schemas/schemas";

import {
  useRemoveTrackAudioMutation,
  useUploadTrackAudioMutation,
} from "./use-track-audio";

export function useUploadTrack(track: Track | null, onSuccess: () => void) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadTrackAudioMutation();
  const removeMutation = useRemoveTrackAudioMutation();

  const isMutating = uploadMutation.isPending || removeMutation.isPending;

  useEffect(() => {
    setAudioUrl(O.toNullable(api.getTrackAudioUrl(track?.audioFile ?? null)));
  }, [track?.audioFile]);

  const resetState = () => {
    setUploadProgress(0);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedMimeTypes = [
        "audio/mpeg",
        "audio/wav",
        "audio/mp3",
        "audio/x-wav",
      ];
      if (!allowedMimeTypes.includes(file.type)) {
        toast.error("Invalid file type", {
          description: "Please upload an MP3 or WAV file only.",
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setSelectedFile(file);
      setUploadProgress(0);
    }
  };

  const handleBrowseClick = () => fileInputRef.current?.click();

  const handleClearSelection = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = () => {
    if (!selectedFile || !track?.id) return;

    setUploadProgress(50);
    uploadMutation.mutate(
      { trackId: track.id, file: selectedFile, fileName: selectedFile.name },
      {
        onSuccess: () => {
          setUploadProgress(100);
          setTimeout(() => {
            resetState();
            onSuccess();
          }, 800);
        },
        onError: () => {
          setUploadProgress(0);
        },
      }
    );
  };

  const handleRemoveFile = () => {
    if (!track?.id) return;
    removeMutation.mutate(track.id, {
      onSuccess: () => {
        setAudioUrl(null);
        resetState();
        onSuccess();
      },
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  return {
    uploadProgress,
    selectedFile,
    audioUrl,
    isMutating,

    fileInputRef,

    uploadMutation,
    removeMutation,

    handleFileChange,
    handleBrowseClick,
    handleClearSelection,
    handleUpload,
    handleRemoveFile,
    resetState,

    formatFileSize,
  };
}
