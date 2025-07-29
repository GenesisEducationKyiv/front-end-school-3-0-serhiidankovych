import { subscriptionApi } from "./subscriptions";
import { trackApi } from "./tracks";
import { getTrackAudioUrl } from "./utils";

export { handleApiError, makeRequest } from "./core";
export { buildQueryParams, getTrackAudioUrl } from "./utils";

export interface ApiError {
  error: string;
  message: string;
}

export const api = {
  ...trackApi,
  ...subscriptionApi,
  getTrackAudioUrl,
};

export { subscriptionApi } from "./subscriptions";
export { trackApi } from "./tracks";
