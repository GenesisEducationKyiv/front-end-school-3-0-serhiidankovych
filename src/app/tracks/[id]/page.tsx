import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { TrackDetailContent } from "@/features/tracks/components/pages/track-detail-content";
import { generateTrackMetadata } from "@/features/tracks/lib/metadata";
import { prefetchTrackDetail } from "@/features/tracks/lib/query-client";
import { generateTrackStaticParams } from "@/features/tracks/lib/static-generation";
import { ErrorBoundary } from "@/shared/components/error-boundary";
import { LoadingSpinner } from "@/shared/components/loading-spinner";

interface TrackPageProps {
  params: Promise<{ id: string }>;
}

export const generateStaticParams = generateTrackStaticParams;

export async function generateMetadata({ params }: TrackPageProps) {
  const resolvedParams = await params;
  return generateTrackMetadata(resolvedParams.id);
}

export default async function TrackPage({ params }: TrackPageProps) {
  const resolvedParams = await params;
  const trackId = resolvedParams.id;

  const { queryClient, track, success } = await prefetchTrackDetail(trackId);

  if (!success || !track) {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary
        title="Failed to load track"
        description="There was an error loading the track details. Please try again."
      >
        <Suspense fallback={<LoadingSpinner message="Loading track..." />}>
          <TrackDetailContent trackId={trackId} initialTrack={track} />
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
}
