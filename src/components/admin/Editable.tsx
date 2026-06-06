"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";

/**
 * Editable — wraps text that can be edited inline when in edit mode (?edit=1).
 *
 * For normal visitors: renders as a transparent <span> with zero overhead.
 * In edit mode: adds hover highlight, click-to-edit (contentEditable),
 * and sends changes to the admin parent via postMessage.
 */
export function Editable({
  id,
  children,
  as: Tag = "span",
  className,
  multiline = false,
}: {
  /** Unique field ID matching the content key (e.g. "stats_years") */
  id: string;
  children: React.ReactNode;
  /** HTML tag to render. Default: "span" */
  as?: "span" | "div" | "p" | "h1" | "h2" | "h3" | "h4";
  className?: string;
  /** Allow line breaks (renders as div with whitespace preservation) */
  multiline?: boolean;
}) {
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("edit") === "1";
  const ref = React.useRef<HTMLElement>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isModified, setIsModified] = React.useState(false);
  const originalText = React.useRef<string>("");

  // Store original text on mount
  React.useEffect(() => {
    if (isEditMode && ref.current) {
      originalText.current = ref.current.textContent || "";
    }
  }, [isEditMode]);

  // Listen for reset messages from parent
  React.useEffect(() => {
    if (!isEditMode) return;
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "INLINE_EDIT_RESET") {
        if (ref.current) {
          ref.current.textContent = originalText.current;
          setIsModified(false);
          setIsEditing(false);
        }
      }
      if (e.data?.type === "INLINE_EDIT_SAVED") {
        // After save, current text becomes the new "original"
        if (ref.current) {
          originalText.current = ref.current.textContent || "";
          setIsModified(false);
        }
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [isEditMode]);

  if (!isEditMode) {
    // Normal mode — zero overhead
    return <Tag className={className}>{children}</Tag>;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isEditing) {
      setIsEditing(true);
      // Focus and select all text
      setTimeout(() => {
        if (ref.current) {
          ref.current.focus();
          const selection = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(ref.current);
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }, 0);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (ref.current) {
      const newText = ref.current.textContent || "";
      const changed = newText !== originalText.current;
      setIsModified(changed);
      // Send change to admin parent
      window.parent.postMessage(
        {
          type: "INLINE_EDIT_CHANGE",
          id,
          value: newText,
          changed,
        },
        "*"
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      // Cancel editing — restore original
      if (ref.current) {
        ref.current.textContent = originalText.current;
        setIsModified(false);
      }
      setIsEditing(false);
      ref.current?.blur();
    }
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      ref.current?.blur();
    }
  };

  return (
    <Tag
      ref={ref as any}
      className={`editable-field ${isEditing ? "editable-active" : ""} ${isModified ? "editable-modified" : ""} ${className || ""}`}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onClick={handleClick}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      data-editable-id={id}
      style={{ outline: "none" }}
    >
      {children}
    </Tag>
  );
}
