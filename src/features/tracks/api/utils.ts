import { A, D, G, O, pipe } from "@mobily/ts-belt";

import { TrackFilters } from "../types";

const FILES_URL = process.env.NEXT_PUBLIC_FILES_URL!;

export const buildQueryParams = (filters: TrackFilters): string => {
  const params = new URLSearchParams();
  pipe(
    D.toPairs(filters),
    A.forEach(([key, value]) => {
      if (!G.isNullable(value) && value !== "") {
        params.append(key, String(value));
      }
    })
  );
  return params.toString();
};

export const getTrackAudioUrl = (
  audioFileName: string | null
): O.Option<string> => {
  return pipe(
    O.fromNullable(audioFileName),
    O.map((fileName) => `${FILES_URL}${encodeURIComponent(fileName)}`)
  );
};
