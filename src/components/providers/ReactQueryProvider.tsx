/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PropsWithChildren, useState } from "react";
import { QueryClient, QueryCache, QueryClientProvider, Query } from "@tanstack/react-query";
import axios from "axios";
import { toaster } from "../ui/toaster";

const ReactQueryProvider = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => {
    const onError = (error: Error, query: any) => {
      // if (query.meta && query.meta.ignoreError) {
      //   return;
      // }
      // if (query.meta && query.meta.errorMessage) {
      //   console.log("ERROR - ", query.meta.errorMessage);
      //   // toaster.error(query.meta.errorMessage as string);
      // }

      console.log("[React Query] Error:", error, "Query:", query);
      // toaster.error(error.message);
    };

    return new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
        },
        mutations: {
          // Call it by default, but if onError is already provided call the provided one
          onError,
        },
      },
      // TODO: use error boundaries in future
      queryCache: new QueryCache({
        onError,
      }),
    });
  });

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default ReactQueryProvider;
