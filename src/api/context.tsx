/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";

import { ReactNode, createContext, useContext, useMemo } from "react";
import { useAppSession } from "@/hooks/useAppSession";
import { useLocale } from "next-intl";
import { ApiClient } from "./client";

export const ApiClientContext = createContext<ApiClient | null>(null);

export function useApiClient() {
  const apiClient = useContext(ApiClientContext);
  if (!apiClient) {
    throw new Error(
      "ApiClientContext doesn't have a value an api client set up. Make sure you wrap your app in an ApiClientProvider and provide apiClient."
    );
  }

  return apiClient;
}

export const ApiClientProvider = ({ children }: { children: ReactNode }) => {
  const session = useAppSession();
  const locale = useLocale() as "en" | "ru";

  const apiClient = useMemo(() => {
    if (session.data?.accessToken && session.data.user?.id) {
      return new ApiClient(
        session.data.accessToken,
        Number(session.data.user.id),
        locale
      );
    }

    return new ApiClient("", -1, locale);
  }, [locale, session.data?.accessToken, session.data?.user?.id]);

  return (
    <ApiClientContext.Provider value={apiClient}>{children}</ApiClientContext.Provider>
  );
};
