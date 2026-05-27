/**
 * Converts a teacher's name into a URL-friendly slug.
 * Greek characters are transliterated to Latin equivalents.
 */
export function slugifyName(name: string): string {
  const greekToLatin: Record<string, string> = {
    α: "a", ά: "a", β: "v", γ: "g", δ: "d", ε: "e", έ: "e",
    ζ: "z", η: "i", ή: "i", θ: "th", ι: "i", ί: "i", ϊ: "i", ΐ: "i",
    κ: "k", λ: "l", μ: "m", ν: "n", ξ: "x", ο: "o", ό: "o",
    π: "p", ρ: "r", σ: "s", ς: "s", τ: "t", υ: "y", ύ: "y", ϋ: "y", ΰ: "y",
    φ: "f", χ: "ch", ψ: "ps", ω: "o", ώ: "o",
    Α: "a", Ά: "a", Β: "v", Γ: "g", Δ: "d", Ε: "e", Έ: "e",
    Ζ: "z", Η: "i", Ή: "i", Θ: "th", Ι: "i", Ί: "i", Ϊ: "i",
    Κ: "k", Λ: "l", Μ: "m", Ν: "n", Ξ: "x", Ο: "o", Ό: "o",
    Π: "p", Ρ: "r", Σ: "s", Τ: "t", Υ: "y", Ύ: "y", Ϋ: "y",
    Φ: "f", Χ: "ch", Ψ: "ps", Ω: "o", Ώ: "o",
  };

  return name
    .split("")
    .map((ch) => greekToLatin[ch] ?? ch)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Builds the URL segment used in admin edit links.
 * Format: "name-slug"
 */
export function buildTeacherSlug(name: string, id: string): string {
  return `${slugifyName(name)}--${id}`;
}

/**
 * Extracts the ID from a "slugified-name--id" string.
 */
export function extractIdFromTeacherSlug(slug: string): string {
  const parts = slug.split("--");
  return parts.length > 1 ? parts[parts.length - 1] : slug;
}


