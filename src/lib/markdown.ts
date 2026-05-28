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
  let html = markdown
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // Italic
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  // Headers
  html = html.replace(/^### (.*?)$/gm, "<h4 class='text-[16px] font-bold text-slate-800 mt-4 mb-2'>$1</h4>");
  html = html.replace(/^## (.*?)$/gm, "<h3 class='text-[18px] font-bold text-slate-800 mt-5 mb-3'>$1</h3>");
  html = html.replace(/^# (.*?)$/gm, "<h2 class='text-[22px] font-bold text-slate-800 mt-6 mb-4'>$1</h2>");
  // Lists
  html = html.replace(/^\s*-\s+(.*?)$/gm, "<li class='list-disc ml-5 mb-1 text-slate-600'>$1</li>");
  html = html.replace(/^\s*\d+\.\s+(.*?)$/gm, "<li class='list-decimal ml-5 mb-1 text-slate-600'>$1</li>");
  
  // Wrap list tags nicely
  html = html.replace(/(<li class='list-disc[\s\S]*?<\/li>)/g, "<ul class='my-3'>$1</ul>");
  html = html.replace(/(<li class='list-decimal[\s\S]*?<\/li>)/g, "<ol class='my-3'>$1</ol>");

  // Paragraphs
  html = html.split(/\n{2,}/).map(p => {
    const trimmed = p.trim();
    if (
      trimmed.startsWith("<h") || 
      trimmed.startsWith("<ul") || 
      trimmed.startsWith("<ol") || 
      trimmed.startsWith("<li")
    ) {
      return p;
    }
    return `<p class="mb-4 text-slate-600 leading-relaxed text-[14px]">${p.replace(/\n/g, "<br/>")}</p>`;
  }).join("\n");

  return html;
}
