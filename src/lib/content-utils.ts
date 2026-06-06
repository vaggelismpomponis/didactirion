/**
 * Deep-merge DB content onto defaults.
 * DB values take precedence; missing keys fall back to defaults.
 * Empty strings are treated as "no value" — the default is used instead.
 * This version is "client-safe" (no prisma imports).
 */
export function mergeContent<T extends Record<string, any>>(
  defaults: T,
  override: Record<string, any> | null
): T {
  if (!override) return defaults;
  const result: Record<string, any> = { ...defaults };
  for (const key of Object.keys(override)) {
    const defVal = defaults[key];
    const ovrVal = override[key];
    if (
      ovrVal !== null &&
      typeof ovrVal === "object" &&
      !Array.isArray(ovrVal) &&
      typeof defVal === "object" &&
      defVal !== null &&
      !Array.isArray(defVal)
    ) {
      result[key] = mergeContent(defVal, ovrVal);
    } else {
      // Treat empty strings as "no override" — fall back to default
      const isEmpty = typeof ovrVal === "string" && ovrVal.trim() === "";
      result[key] = (ovrVal == null || isEmpty) ? defVal : ovrVal;
    }
  }
  return result as T;
}
