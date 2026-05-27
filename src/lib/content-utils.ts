/**
 * Deep-merge DB content onto defaults.
 * DB values take precedence; missing keys fall back to defaults.
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
      result[key] = ovrVal ?? defVal;
    }
  }
  return result as T;
}
