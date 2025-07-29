"use client";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ApiError } from "@/features/tracks/api";

interface TracksErrorBannerProps {
  error: ApiError | null;
  onRetry: () => void;
}

export function TracksErrorBanner({ error, onRetry }: TracksErrorBannerProps) {
  if (!error) return null;

  return (
    <div className="mb-4 flex items-center justify-between rounded-md border bg-destructive/10 p-4 text-destructive">
      <div className="flex items-center">
        <AlertCircle className="mr-2 h-4 w-4" />
        <span>Error: {error.message}</span>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry} className="text-xs">
        Retry
      </Button>
    </div>
  );
}
