import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { api } from "@/features/tracks/api/api";

import { TrackDetailContent } from "../../../features/tracks/components/pages/track-detail-content";

interface TrackPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  try {
    const response = await api.getTracks({
      page: 1,
      limit: 100,
      search: "",
      genre: "",
      artist: "",
      sort: "",
      order: "",
    });
    return response.data.map((track) => ({
      id: track.id,
    }));
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return [];
  }
}

export default async function TrackPage({ params }: TrackPageProps) {
  const queryClient = new QueryClient();

  const resolvedParams = await params;
  const trackId = resolvedParams.id;

  try {
    const track = await queryClient.fetchQuery({
      queryKey: ["track", trackId],
      queryFn: () => api.getTrack(trackId),
    });

    if (track.artist) {
      await queryClient.prefetchQuery({
        queryKey: ["tracks", { artist: track.artist, limit: 5 }],
        queryFn: () =>
          api.getTracks({
            page: 1,
            limit: 5,
            search: "",
            genre: "",
            artist: track.artist,
            sort: "",
            order: "",
          }),
      });
    }

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<Loader className="animate-spin" />}>
          <TrackDetailContent trackId={trackId} initialTrack={track} />
        </Suspense>
      </HydrationBoundary>
    );
  } catch (error) {
    notFound();
  }
}

export async function generateMetadata({ params }: TrackPageProps) {
  try {
    const resolvedParams = await params;
    const track = await api.getTrack(resolvedParams.id);

    return {
      title: `${track.title} - ${track.artist}`,
      id: track.id,
    };
  } catch (error) {
    return {
      title: "Track Not Found",
      description: "The requested track could not be found.",
    };
  }
}
