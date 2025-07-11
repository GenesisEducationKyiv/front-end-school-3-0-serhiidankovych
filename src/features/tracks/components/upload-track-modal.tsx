import { O } from "@mobily/ts-belt";
import { FileAudio, Loader2, Trash, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Track } from "@/features/tracks/schemas/schemas";

import { api } from "../api/api";
import { useRemoveTrackAudio,useUploadTrackAudio } from "../hooks/use-track-audio";

interface UploadTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: Track;
  onSuccess: () => void;
}

export function UploadTrackModal({
  isOpen,
  onClose,
  track,
  onSuccess,
}: UploadTrackModalProps) {
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  
  const uploadMutation = useUploadTrackAudio();
  const removeMutation = useRemoveTrackAudio();

  
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
      const allowedMimeTypes = ["audio/mpeg", "audio/wav", "audio/mp3", "audio/x-wav"];
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

  const handleOpenChange = (open: boolean) => {
    
    if (!open && !isMutating) {
      resetState();
      onClose();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Audio File</DialogTitle>
          <DialogDescription>
            Upload or remove the audio file for {track?.title || "this track"}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="audio/*"
            className="hidden"
            disabled={isMutating}
          />

          {audioUrl && !selectedFile && (
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-md">
                  <FileAudio className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Current audio file</p>
                  <p className="text-sm text-muted-foreground truncate max-w-[280px]">
                    {track.audioFile}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveFile}
                disabled={isMutating}
              >
                {removeMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Removing...
                  </>
                ) : (
                  <>
                    <Trash className="h-4 w-4 mr-2" />
                    Remove
                  </>
                )}
              </Button>
            </div>
          )}

          {!selectedFile && !audioUrl && (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                isMutating
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:border-primary/50"
              }`}
              onClick={isMutating ? undefined : handleBrowseClick}
            >
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <h3 className="font-medium text-lg">Upload an audio file</h3>
                <p className="text-sm text-muted-foreground">Click to browse or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-2">Supports MP3, WAV</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={(e) => { e.stopPropagation(); handleBrowseClick(); }}
                  disabled={isMutating}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Browse files
                </Button>
              </div>
            </div>
          )}

          {selectedFile && (
            <div className="border rounded-md p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-md">
                    <FileAudio className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium truncate max-w-[250px]">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                  </div>
                </div>
                {!uploadMutation.isPending && (
                  <Button variant="ghost" size="icon" onClick={handleClearSelection} className="h-8 w-8" aria-label="Clear selected file">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {uploadMutation.isPending && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-sm text-right text-muted-foreground">
                    {uploadProgress === 100 ? "Complete!" : "Uploading..."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="space-x-2">
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isMutating}>
            Cancel
          </Button>

          {selectedFile && (
            <Button onClick={handleUpload} disabled={uploadMutation.isPending}>
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : audioUrl ? "Replace File" : "Upload File"}
            </Button>
          )}

          {!selectedFile && audioUrl && (
            <Button variant="default" onClick={handleBrowseClick} disabled={isMutating}>
              <Upload className="mr-2 h-4 w-4" />
              Upload New File
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}