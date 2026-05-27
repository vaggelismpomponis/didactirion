"use client";

import * as React from "react";
import { PreviewListener } from "@/components/admin/PreviewListener";

export function ExamsPreviewSync({ pageKey, slug }: { pageKey: string; slug: string }) {
  const handlePreviewUpdate = React.useCallback(
    (override: Record<string, any>) => {
      window.__didactirionPreviewState = override;
      window.dispatchEvent(new CustomEvent("didactirion:preview", { detail: override }));
    },
    []
  );

  return <PreviewListener pageKey={pageKey} onContentUpdate={handlePreviewUpdate} />;
}

declare global {
  interface Window {
    __didactirionPreviewState?: any;
  }
}
