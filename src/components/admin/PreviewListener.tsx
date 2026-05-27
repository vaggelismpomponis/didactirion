"use client";

import * as React from "react";

interface PreviewListenerProps {
  pageKey: string;
  onContentUpdate: (content: Record<string, any>) => void;
}

/**
 * Invisible client component that listens for postMessage updates
 * from the admin split-screen editor preview iframe.
 */
export function PreviewListener({ pageKey, onContentUpdate }: PreviewListenerProps) {
  React.useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (
        event.data?.type === "DIDACTIRION_PREVIEW" &&
        event.data?.pageKey === pageKey
      ) {
        onContentUpdate(event.data.content ?? {});
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [pageKey, onContentUpdate]);

  return null;
}
