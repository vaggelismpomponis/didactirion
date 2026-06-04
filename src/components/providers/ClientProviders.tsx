/**
 * ClientProviders – thin pass-through wrapper.
 *
 * The previous implementation dynamically imported PageTransition and
 * ScrollReveal here, which caused a BAILOUT_TO_CLIENT_SIDE_RENDERING for
 * everything inside <main>. Individual page sections already use their own
 * <ScrollReveal> instances so wrapping the entire tree was redundant and
 * prevented SSR of the page body.
 */
export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
