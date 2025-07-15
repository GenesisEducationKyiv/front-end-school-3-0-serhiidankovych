import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { Suspense } from "react";

import { api } from "@/features/tracks/api/api";
import { TracksPageContent } from "@/features/tracks/components/pages/tracks-page-content";
import { ITEMS_PER_PAGE } from "@/features/tracks/hooks/use-tracks";
import {
  ComponentTrackFilters,
  SearchParams,
  TrackOrder,
  TrackSort,
} from "@/features/tracks/types";

interface TracksPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function TracksPage({ searchParams }: TracksPageProps) {
  const queryClient = new QueryClient();

  const resolvedSearchParams = await searchParams;

  const currentPage = parseInt(resolvedSearchParams.page || "1", 10);
  const filters: ComponentTrackFilters = {
    search: resolvedSearchParams.search || "",
    genre: resolvedSearchParams.genre || "",
    artist: resolvedSearchParams.artist || "",
    sort: resolvedSearchParams.sort as TrackSort,
    order: resolvedSearchParams.order as TrackOrder,
  };

  const queryParams = {
    ...filters,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  };

  try {
    await queryClient.prefetchQuery({
      queryKey: ["tracks", queryParams],
      queryFn: () => api.getTracks(queryParams),
    });
  } catch (error) {
    console.error("Failed to prefetch tracks:", error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Loader className="animate-spin" />}>
        <TracksPageContent initialPage={currentPage} initialFilters={filters} />
      </Suspense>
    </HydrationBoundary>
  );
}
