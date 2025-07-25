import { FileAudio, Loader2, Trash, Upload, X } from "lucide-react";

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
import { useUploadTrack } from "@/features/tracks/hooks/use-upload-track";
import { Track } from "@/features/tracks/schemas/schemas";

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
  const {
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
  } = useUploadTrack(track, onSuccess);

  const handleOpenChange = (open: boolean) => {
    if (!open && !isMutating) {
      resetState();
      onClose();
    }
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
                <p className="text-sm text-muted-foreground">
                  Click to browse or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Supports MP3, WAV
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBrowseClick();
                  }}
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
                    <p className="font-medium truncate max-w-[250px]">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
                {!uploadMutation.isPending && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClearSelection}
                    className="h-8 w-8"
                    aria-label="Clear selected file"
                  >
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
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isMutating}
          >
            Cancel
          </Button>
          {selectedFile && (
            <Button onClick={handleUpload} disabled={uploadMutation.isPending}>
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : audioUrl ? (
                "Replace File"
              ) : (
                "Upload File"
              )}
            </Button>
          )}
          {!selectedFile && audioUrl && (
            <Button
              variant="default"
              onClick={handleBrowseClick}
              disabled={isMutating}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload New File
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
