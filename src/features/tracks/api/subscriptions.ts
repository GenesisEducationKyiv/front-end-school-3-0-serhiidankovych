import { Sink } from "graphql-ws";
import { toast } from "sonner";

import graphqlClient from "../lib/graphql-client";

export const subscriptionApi = {
  subscribeToActiveTrack(
    onData: (trackName: string | null) => void
  ): () => void {
    const sink: Sink<{
      data: {
        activeTrackChanged: string | null;
      };
      activeTrackChanged: string | null;
    }> = {
      next: (result) => {
        const trackName = result.data?.activeTrackChanged ?? null;
        onData(trackName);
      },
      error: (err) => {
        toast.error("Subscription error." + err);
      },
      complete: () => {
        toast.success("Subscription completed.");
      },
    };

    const unsubscribe = graphqlClient.subscribe(
      {
        query: "subscription { activeTrackChanged }",
      },
      sink
    );

    return unsubscribe;
  },
};
