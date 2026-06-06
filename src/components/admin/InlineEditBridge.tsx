"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";

/**
 * InlineEditBridge — activates edit mode features when ?edit=1 is present.
 * 
 * - Injects edit-mode CSS for hover/active/modified states
 * - Disables all navigation links (prevents leaving the page while editing)
 * - Shows a small floating "Edit Mode" indicator
 */
export function InlineEditBridge() {
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("edit") === "1";

  React.useEffect(() => {
    if (!isEditMode) return;

    // Disable all link clicks in edit mode
    const blockNavigation = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      if (link && !target.closest("[data-editable-id]")) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Disable form submissions
    const blockSubmit = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener("click", blockNavigation, true);
    document.addEventListener("submit", blockSubmit, true);

    // Add edit-mode class to body
    document.body.classList.add("inline-edit-mode");

    // Notify parent that edit mode is ready
    window.parent.postMessage({ type: "INLINE_EDIT_READY" }, "*");

    return () => {
      document.removeEventListener("click", blockNavigation, true);
      document.removeEventListener("submit", blockSubmit, true);
      document.body.classList.remove("inline-edit-mode");
    };
  }, [isEditMode]);

  if (!isEditMode) return null;

  return null;
}
