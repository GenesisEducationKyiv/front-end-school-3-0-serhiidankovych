import { createClient } from "graphql-ws";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL!;

const client = createClient({
  url: WS_URL,
});

export default client;
