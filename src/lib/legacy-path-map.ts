/** WordPress slug → Next.js path (decoded pathname segment, no leading/trailing slashes). */
const LEGACY_PATH_MAP: Record<string, string> = {
  "οι-καθηγητές": "/organization/teachers",
  "oi-kathigites-mas-kai-oi": "/organization/teachers",
  "επιτυχόντες": "/organization/success-stories",
  epitychontes: "/organization/success-stories",
  "ιστορία": "/organization/history",
  "φιλοσοφία": "/organization/history",
  "φωτογραφικό-υλικό": "/organization/gallery",
  "τμήματα-επάλ": "/curricula/epal",
  "σύστημα-επιτυχίας": "/organization/success-stories",
  "σύστημα-αξιολόγησης": "/organization/history",
  "εκδόσεις": "/announcements",
  "μπάνερ-συνεργάτες": "/",
  "αυτόματος-υπολογισμός-βάσεων-μορίων": "/points-calculator",
  "ypologismos-morion": "/points-calculator",
  "γενικά-θέματα-άρθρα": "/announcements",
  "genika-themata-arthra": "/announcements",
  "οδηγός-σταδιοδρομίας-επικαιρότητα-α": "/announcements",
  anakoinoseis: "/announcements",
  "γυμνάσιο": "/curricula/junior-high",
  "α-λυκείου": "/curricula/high-school",
  "β-λυκείου": "/curricula/high-school",
  "γ-λυκείου": "/curricula/high-school",
  "g-lykeiou": "/curricula/high-school",
  "απόφοιτοι": "/curricula/alumni",
  "εισαγωγή-στα-πρότυπα": "/curricula/model-schools",
  "μαθήματα-προγραμματισμού-σε-scratch": "/curricula/junior-high",
  "μαθηματικά-python-πως-να-ξεκινήσεις-από-το-μη": "/announcements",
  "μαθήματα-video-conference": "http://www.eclass.didactirion.gr/",
  "πανελλαδικές-εξετάσεις": "/exams/panhellenic",
  "πανελλαδικές-εξετάσεις-2023": "/exams/panhellenic",
  // "το-νέο-λύκειο": "/exams/new-high-school",
  "προγραμμα-διαγωνισμάτων": "/exams/panhellenic",
  "programma-diagonismaton-sch-etous-2022-2023": "/exams/panhellenic",
  "θέματα-οεφε": "/exams/oefe",
  "επαναληπτικά-θέματα-οεφε-2022-2023": "/exams/oefe",
  "τράπεζα-θεμάτων": "/exams/question-bank",
  "τράπεζα-θεμάτων-α-β-λυκείου": "/exams/question-bank",
  "νέο-θερίνη-προετοιμασία-2023": "/announcements",
  "επικοινωνία": "/contact",
  epikoinonia: "/contact",
  contact: "/contact",
  "φυσική": "/curricula/high-school",
  fysiki: "/curricula/high-school",
  register: "/",
};

/**
 * Resolve a legacy WordPress path to a Next.js route (or external URL).
 */
export function getLegacyDestination(pathname: string): string | null {
  let decoded = pathname;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    decoded = pathname;
  }

  if (/^\/(20\d{2})(\/|$)/.test(decoded)) {
    return "/announcements";
  }

  const slug = decoded.replace(/^\/+|\/+$/g, "");
  if (!slug) {
    return null;
  }

  return LEGACY_PATH_MAP[slug] ?? null;
}
