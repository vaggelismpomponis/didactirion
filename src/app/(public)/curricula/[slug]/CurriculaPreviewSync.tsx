"use client";

import * as React from "react";
import { PreviewListener } from "@/components/admin/PreviewListener";
import { mergeContent } from "@/lib/content-utils";

export function CurriculaPreviewSync({
  pageKey,
  slug,
  initialData,
  defaults,
}: {
  pageKey: string;
  slug: string;
  initialData: any;
  defaults: any;
}) {
  const handlePreviewUpdate = React.useCallback(
    (override: Record<string, any>) => {
      // Signal sibling re-render by updating window-level state
      // (parent server component handles this via CurriculumView; 
      // for true live preview we use the iframe approach)
      const merged = mergeContent(defaults ?? {}, override);
      window.__didactirionPreviewState = merged;
      window.dispatchEvent(new CustomEvent("didactirion:preview", { detail: merged }));
    },
    [defaults]
  );

  return <PreviewListener pageKey={pageKey} onContentUpdate={handlePreviewUpdate} />;
}

declare global {
  interface Window {
    __didactirionPreviewState?: any;
  }
}
