import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { APP_CONFIG } from "@/config/app";
import { TracksPageContent } from "@/features/tracks/components/pages/tracks-page-content";
import { generateTracksMetadata } from "@/features/tracks/lib/metadata";
import { prefetchTracks } from "@/features/tracks/lib/query-client";
import {
  ComponentTrackFilters,
  SearchParams,
  TrackOrder,
  TrackSort,
} from "@/features/tracks/types";
import { ErrorBoundary } from "@/shared/components/error-boundary";
import { LoadingSpinner } from "@/shared/components/loading-spinner";

interface TracksPageProps {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({ searchParams }: TracksPageProps) {
  const resolvedSearchParams = await searchParams;
  return generateTracksMetadata(resolvedSearchParams);
}

export default async function TracksPage({ searchParams }: TracksPageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || "1", 10);

  if (isNaN(currentPage) || currentPage < 1) {
    redirect("/tracks");
  }

  const filters: ComponentTrackFilters = {
    search: resolvedSearchParams.search || "",
    genre: resolvedSearchParams.genre || "",
    artist: resolvedSearchParams.artist || "",
    sort: resolvedSearchParams.sort as TrackSort,
    order: resolvedSearchParams.order as TrackOrder,
  };

  const { queryClient } = await prefetchTracks(
    filters,
    currentPage,
    APP_CONFIG.TRACKS.ITEMS_PER_PAGE
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary
        title="Failed to load tracks"
        description="There was an error loading the tracks. Please try again."
      >
        <Suspense fallback={<LoadingSpinner message="Loading tracks..." />}>
          <TracksPageContent
            initialPage={currentPage}
            initialFilters={filters}
          />
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
}
