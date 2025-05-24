"use client";

import type React from "react";
import { Provider } from "jotai";
import { ComposeModalProvider } from "@/providers/ComposeModalProvider";
import { jotaiStore } from "@/store";
import { ThemeProvider } from "@/components/theme-provider";
import { IntercomProvider } from "react-use-intercom";
import { env } from "@/env";

export function AppProviders(props: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <Provider store={jotaiStore}>
        <IntercomProvider appId={env.NEXT_PUBLIC_INTERCOM_APP_ID}>
          <ComposeModalProvider>{props.children}</ComposeModalProvider>
        </IntercomProvider>
      </Provider>
    </ThemeProvider>
  );
}
