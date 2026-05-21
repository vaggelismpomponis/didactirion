import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Υπολογισμός Μορίων",
  description:
    "Αυτόματος υπολογισμός βάσεων μορίων για τις Πανελλαδικές Εξετάσεις. Διδακτήριον.",
  path: "/points-calculator",
});

export default function PointsCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
