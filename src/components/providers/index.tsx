"use client";

import React, { PropsWithChildren } from "react";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ToastContainer } from "react-toastify";
import { ApiClientProvider } from "@/api/context";
import ReactQueryProvider from "./ReactQueryProvider";
import NotificationProvider from "./NotificationProvider";
import muiTheme from "@/styles/muiTheme";

const Providers = ({
  children,
  session,
}: PropsWithChildren<{ session: Session | null }>) => {
  return (
    <SessionProvider session={session}>
      <ApiClientProvider>
        <ReactQueryProvider>
          <NotificationProvider>
            <AppRouterCacheProvider>
              <ToastContainer
                closeOnClick
                icon={false}
                closeButton={false}
                hideProgressBar
                position="bottom-right"
                bodyClassName={() => "123 "}
                toastClassName={() => "baga mb-4"}
              />
              <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
            </AppRouterCacheProvider>
          </NotificationProvider>
        </ReactQueryProvider>
      </ApiClientProvider>
    </SessionProvider>
  );
};

export default Providers;
