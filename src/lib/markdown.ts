// Greek to Latin transliteration helper
export function transliterateGreek(text: string): string {
  const greekToLatinMap: { [key: string]: string } = {
    'α': 'a', 'β': 'v', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'i', 'θ': 'th',
    'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': 'x', 'ο': 'o', 'π': 'p',
    'ρ': 'r', 'σ': 's', 'ς': 's', 'τ': 't', 'υ': 'y', 'φ': 'f', 'χ': 'ch', 'ψ': 'ps',
    'ω': 'o',
    'ά': 'a', 'έ': 'e', 'ή': 'i', 'ί': 'i', 'ό': 'o', 'ύ': 'y', 'ώ': 'o',
    'ϊ': 'i', 'ϋ': 'y', 'ΐ': 'i', 'ΰ': 'y',
    'Α': 'A', 'Β': 'V', 'Γ': 'G', 'Δ': 'D', 'Ε': 'E', 'Ζ': 'Z', 'Η': 'I', 'Θ': 'Th',
    'Ι': 'I', 'Κ': 'K', 'Λ': 'L', 'Μ': 'M', 'Ν': 'N', 'Ξ': 'X', 'Ο': 'O', 'Π': 'P',
    'Ρ': 'R', 'Σ': 'S', 'Τ': 'T', 'Υ': 'Y', 'Φ': 'F', 'Χ': 'Ch', 'Ψ': 'Ps', 'Ω': 'O',
    'Ά': 'A', 'Έ': 'E', 'Ή': 'I', 'Ί': 'I', 'Ό': 'O', 'Ύ': 'Y', 'Ώ': 'O'
  };

  return text
    .split('')
    .map(char => greekToLatinMap[char] || char)
    .join('');
}

// Basic client-side markdown to html parser
export function parseMarkdownToHtml(markdown: string): string {
  if (!markdown) return "";
  
  // Escape HTML characters
  let escaped = markdown
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Split into lines
  const lines = escaped.split(/\r?\n/);
  const result: string[] = [];
  
  let inUnorderedList = false;
  let inOrderedList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check for lists
    const unorderedMatch = line.match(/^(\s*)-\s+(.*)$/);
    const orderedMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);

    if (unorderedMatch) {
      if (inOrderedList) {
        result.push("</ol>");
        inOrderedList = false;
      }
      if (!inUnorderedList) {
        result.push("<ul class='my-3 list-disc pl-5'>");
        inUnorderedList = true;
      }
      const content = parseInline(unorderedMatch[2]);
      result.push(`<li class='mb-1 text-slate-600 text-[14px]'>${content}</li>`);
      continue;
    }

    if (orderedMatch) {
      if (inUnorderedList) {
        result.push("</ul>");
        inUnorderedList = false;
      }
      if (!inOrderedList) {
        result.push("<ol class='my-3 list-decimal pl-5'>");
        inOrderedList = true;
      }
      const content = parseInline(orderedMatch[2]);
      result.push(`<li class='mb-1 text-slate-600 text-[14px]'>${content}</li>`);
      continue;
    }

    // Not a list item, close any open list
    if (inUnorderedList) {
      result.push("</ul>");
      inUnorderedList = false;
    }
    if (inOrderedList) {
      result.push("</ol>");
      inOrderedList = false;
    }

    // Check for headers
    const h3Match = line.match(/^###\s+(.*)$/);
    const h2Match = line.match(/^##\s+(.*)$/);
    const h1Match = line.match(/^#\s+(.*)$/);

    if (h3Match) {
      result.push(`<h4 class='text-[16px] font-bold text-slate-800 mt-4 mb-2'>${parseInline(h3Match[1])}</h4>`);
      continue;
    }
    if (h2Match) {
      result.push(`<h3 class='text-[18px] font-bold text-slate-800 mt-5 mb-3'>${parseInline(h2Match[1])}</h3>`);
      continue;
    }
    if (h1Match) {
      result.push(`<h2 class='text-[22px] font-bold text-slate-800 mt-6 mb-4'>${parseInline(h1Match[1])}</h2>`);
      continue;
    }

    if (trimmed === "") {
      result.push("");
    } else {
      result.push(parseInline(line));
    }
  }

  // Close any remaining list at the end
  if (inUnorderedList) {
    result.push("</ul>");
  }
  if (inOrderedList) {
    result.push("</ol>");
  }

  // Group text lines into paragraphs
  const finalHtml: string[] = [];
  let currentParagraphLines: string[] = [];

  const flushParagraph = () => {
    if (currentParagraphLines.length > 0) {
      const pText = currentParagraphLines.join("<br/>");
      finalHtml.push(`<p class="mb-4 text-slate-600 leading-relaxed text-[14px]">${pText}</p>`);
      currentParagraphLines = [];
    }
  };

  for (let i = 0; i < result.length; i++) {
    const rLine = result[i];
    const isBlockTag = rLine.startsWith("<h") ||
                       rLine.startsWith("<ul") ||
                       rLine.startsWith("</ul>") ||
                       rLine.startsWith("<ol") ||
                       rLine.startsWith("</ol>") ||
                       rLine.startsWith("<li");

    if (isBlockTag) {
      flushParagraph();
      finalHtml.push(rLine);
    } else if (rLine === "") {
      flushParagraph();
    } else {
      currentParagraphLines.push(rLine);
    }
  }
  flushParagraph();

  return finalHtml.join("\n");
}

function parseInline(text: string): string {
  let html = text;
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // Italic
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  // Links: [text](href)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
  return html;
}

export function htmlToMarkdown(html: string): string {
  if (typeof window === "undefined") return "";
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  function walk(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.nodeValue || "";
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return "";
    }

    const el = node as HTMLElement;
    const tagName = el.tagName.toLowerCase();

    const getChildren = () => {
      let childrenVal = "";
      for (let i = 0; i < el.childNodes.length; i++) {
        childrenVal += walk(el.childNodes[i]);
      }
      return childrenVal;
    };

    switch (tagName) {
      case "strong":
      case "b": {
        const cv = getChildren().trim();
        return cv ? `**${cv}**` : "";
      }
      case "em":
      case "i": {
        const cv = getChildren().trim();
        return cv ? `*${cv}*` : "";
      }
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6":
        return `\n\n### ${getChildren().trim()}\n\n`;
      case "ul":
        return `\n\n${getChildren()}\n\n`;
      case "ol": {
        let index = 1;
        let olContent = "";
        for (let i = 0; i < el.childNodes.length; i++) {
          const child = el.childNodes[i];
          if (child.nodeType === Node.ELEMENT_NODE && (child as HTMLElement).tagName.toLowerCase() === "li") {
            const liContent = walk(child);
            olContent += `${index++}. ${liContent.trim()}\n`;
          }
        }
        return `\n\n${olContent}\n\n`;
      }
      case "li": {
        const parentTag = el.parentElement?.tagName.toLowerCase();
        const cv = getChildren();
        if (parentTag === "ol") {
          return cv;
        }
        return `- ${cv.trim()}\n`;
      }
      case "p":
        return `\n\n${getChildren().trim()}\n\n`;
      case "br":
        return "\n";
      case "a": {
        const href = el.getAttribute("href") || "";
        return `[${getChildren().trim() || href}](${href})`;
      }
      case "div":
        return `\n${getChildren()}\n`;
      default:
        return getChildren();
    }
  }

  let result = walk(doc.body);

  // Clean up multiple newlines and spaces
  result = result
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return result;
}

