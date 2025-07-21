export const APP_CONFIG = {
  TRACKS: {
    ITEMS_PER_PAGE: 20,
    STATIC_GENERATION_LIMIT: 100,
    MAX_STATIC_PAGES: 5,
  },
  CACHE: {
    STALE_TIME: 5 * 60 * 1000,
    GC_TIME: 10 * 60 * 1000,
  },
} as const;
