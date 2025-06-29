import { createClient } from "graphql-ws";

const WS_URL = "ws://localhost:8000/graphql";

const client = createClient({
  url: WS_URL,
});

export default client;
