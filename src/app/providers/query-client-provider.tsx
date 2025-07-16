"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { createClientQueryClient } from "@/config/query-client";

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(createClientQueryClient);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
