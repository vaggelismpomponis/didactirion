"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Bold, 
  Italic, 
  Heading3, 
  List, 
  ListOrdered, 
  Link as LinkIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseMarkdownToHtml, htmlToMarkdown } from "@/lib/markdown";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Γράψτε εδώ...", 
  className = "" 
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastMarkdownRef = useRef<string>("");
  const isEditingRef = useRef<boolean>(false);

  const [activeStyles, setActiveStyles] = useState({
    bold: false,
    italic: false,
    heading: false,
    bulletList: false,
    orderedList: false,
  });

  // Convert markdown to HTML and set initial editor content
  useEffect(() => {
    if (editorRef.current && value !== lastMarkdownRef.current) {
      // Avoid overwriting DOM while the user is actively editing
      if (!isEditingRef.current) {
        editorRef.current.innerHTML = parseMarkdownToHtml(value || "");
        lastMarkdownRef.current = value || "";
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      isEditingRef.current = true;
      const html = editorRef.current.innerHTML;
      
      // If editor contains only a single empty tag, treat it as empty
      const isEmpty = editorRef.current.textContent?.trim() === "" && 
                      editorRef.current.querySelectorAll("img, iframe, table").length === 0;
      
      const markdown = isEmpty ? "" : htmlToMarkdown(html);
      lastMarkdownRef.current = markdown;
      onChange(markdown);
      
      if (isEmpty) {
        document.execCommand("bold", false);
        checkActiveStyles();
      }
      
      // Reset isEditing after a brief moment to allow external syncing
      setTimeout(() => {
        isEditingRef.current = false;
      }, 10);
    }
  };

  // Inspect the current selection node path to detect active formats
  const getActiveBlockType = () => {
    if (typeof window === "undefined" || !editorRef.current) return "";
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return "";
    
    let container: Node | null = selection.getRangeAt(0).commonAncestorContainer;
    if (container.nodeType === Node.TEXT_NODE) {
      container = container.parentNode;
    }
    
    while (container && container !== editorRef.current) {
      if (container.nodeType === Node.ELEMENT_NODE) {
        const el = container as HTMLElement;
        const tagName = el.tagName.toLowerCase();
        if (tagName === "h4" || tagName === "h3" || tagName === "h2" || tagName === "h1") {
          return "heading";
        }
        if (tagName === "ul") return "bulletList";
        if (tagName === "ol") return "orderedList";
      }
      container = container.parentNode;
    }
    return "";
  };

  const checkActiveStyles = () => {
    if (typeof window === "undefined" || !editorRef.current) return;
    
    const blockType = getActiveBlockType();
    const isEmpty = editorRef.current.textContent?.trim() === "" && 
                    editorRef.current.querySelectorAll("img, iframe, table").length === 0;

    setActiveStyles({
      bold: isEmpty ? true : document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      heading: blockType === "heading",
      bulletList: blockType === "bulletList" || document.queryCommandState("insertUnorderedList"),
      orderedList: blockType === "orderedList" || document.queryCommandState("insertOrderedList"),
    });
  };

  const handleFocus = () => {
    checkActiveStyles();
    
    if (editorRef.current) {
      const isEmpty = editorRef.current.textContent?.trim() === "" && 
                      editorRef.current.querySelectorAll("img, iframe, table").length === 0;
      if (isEmpty) {
        setTimeout(() => {
          if (document.activeElement === editorRef.current) {
            document.execCommand("bold", false);
            checkActiveStyles();
          }
        }, 10);
      }
    }
  };


  const executeCommand = (command: string, val: string = "") => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, val);
      handleInput();
      checkActiveStyles();
    }
  };

  const toggleHeading = () => {
    // If inside a heading, revert to paragraph, else format block to H4 (subheading)
    const blockType = getActiveBlockType();
    if (blockType === "heading") {
      executeCommand("formatBlock", "<p>");
    } else {
      executeCommand("formatBlock", "<h4>");
    }
  };

  const addLink = () => {
    const url = prompt("Εισάγετε το URL του συνδέσμου:", "https://");
    if (url) {
      executeCommand("createLink", url);
    }
  };

  const handleEditorClick = (e: React.MouseEvent) => {
    // Only focus if the click was directly on the container and not selection targets
    if (e.target === editorRef.current) {
      editorRef.current.focus();
    }
  };

  const buttonClass = (isActive: boolean) =>
    `w-8 h-8 rounded-lg text-slate-600 transition-all cursor-pointer ${
      isActive
        ? "bg-white text-blue-600 border border-slate-200/60 shadow-sm font-bold scale-[1.03]"
        : "hover:bg-white hover:text-blue-600"
    }`;

  return (
    <div className={`w-full rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all ${className}`}>
      {/* Scope list & heading styles directly inside the WYSIWYG container */}
      <style dangerouslySetInnerHTML={{ __html: `
        .wysiwyg-editor {
          outline: none;
        }
        .wysiwyg-editor ul {
          list-style-type: disc !important;
          padding-left: 1.25rem !important;
          margin-top: 0.5rem !important;
          margin-bottom: 0.5rem !important;
        }
        .wysiwyg-editor ol {
          list-style-type: decimal !important;
          padding-left: 1.25rem !important;
          margin-top: 0.5rem !important;
          margin-bottom: 0.5rem !important;
        }
        .wysiwyg-editor li {
          margin-bottom: 0.25rem !important;
          color: #475569 !important;
        }
        .wysiwyg-editor h4 {
          font-size: 1.05rem !important;
          font-weight: 700 !important;
          margin-top: 1rem !important;
          margin-bottom: 0.5rem !important;
          color: #1e293b !important;
        }
        .wysiwyg-editor p {
          margin-bottom: 0.75rem !important;
          color: #475569 !important;
          line-height: 1.625 !important;
        }
        .wysiwyg-editor a {
          color: #2563eb !important;
          text-decoration: underline !important;
        }
        .wysiwyg-editor:empty:before {
          content: attr(data-placeholder);
          color: #94a3b8;
          cursor: text;
        }
      `}} />

      {/* Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-1.5 bg-slate-50 border-b border-slate-100 select-none">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={buttonClass(activeStyles.bold)}
          onClick={() => executeCommand("bold")}
          title="Έντονα (Bold)"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={buttonClass(activeStyles.italic)}
          onClick={() => executeCommand("italic")}
          title="Πλάγια (Italic)"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={buttonClass(activeStyles.heading)}
          onClick={toggleHeading}
          title="Υπότιτλος (Heading)"
        >
          <Heading3 className="w-4 h-4" />
        </Button>
        
        <div className="w-[1px] h-5 bg-slate-200 mx-1" />
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={buttonClass(activeStyles.bulletList)}
          onClick={() => executeCommand("insertUnorderedList")}
          title="Λίστα με κουκκίδες (Bullet List)"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={buttonClass(activeStyles.orderedList)}
          onClick={() => executeCommand("insertOrderedList")}
          title="Αριθμημένη λίστα (Numbered List)"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        
        <div className="w-[1px] h-5 bg-slate-200 mx-1" />
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="w-8 h-8 rounded-lg text-slate-600 hover:bg-white hover:text-blue-600 cursor-pointer"
          onClick={addLink}
          title="Σύνδεσμος (Link)"
        >
          <LinkIcon className="w-4 h-4" />
        </Button>
        
        <span className="text-[11px] text-slate-400 font-medium ml-auto pr-2 hidden sm:inline-block">
          Ζωντανή επεξεργασία (WYSIWYG)
        </span>
      </div>

      {/* contentEditable Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyUp={checkActiveStyles}
        onMouseUp={checkActiveStyles}
        onFocus={handleFocus}
        onClick={handleEditorClick}
        data-placeholder={placeholder}
        className="wysiwyg-editor p-4 min-h-[200px] max-h-[480px] overflow-y-auto text-[13.5px] leading-relaxed text-slate-700 bg-white"
        style={{ boxSizing: "border-box" }}
      />
    </div>
  );
}
