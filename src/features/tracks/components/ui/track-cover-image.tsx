import { ImageIcon } from "lucide-react";
import Image from "next/image";

import { Track } from "@/features/tracks/schemas/schemas";

interface TrackCoverImageProps {
  track: Track;
}

export const TrackCoverImage = ({ track }: TrackCoverImageProps) => (
  <div className="relative h-10 w-10 rounded overflow-hidden">
    {track.coverImage ? (
      <Image
        src={track.coverImage}
        alt={`${track.title} cover`}
        fill
        loading="lazy"
        className="object-cover"
        sizes="40px"
      />
    ) : (
      <div className="h-10 w-10 bg-muted flex items-center justify-center">
        <ImageIcon className="h-4 w-4 text-muted-foreground" />
      </div>
    )}
  </div>
);
