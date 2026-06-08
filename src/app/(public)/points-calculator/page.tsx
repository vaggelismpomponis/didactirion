import { createPageMetadata } from "@/lib/seo";
import { getPageContent, mergeContent } from "@/lib/page-content";
import { PointsCalculatorClient } from "./PointsCalculatorClient";
import { defaultCalculatorContent } from "./calculator-content";

export const metadata = createPageMetadata({
  title: "Υπολογισμός Μορίων",
  description:
    "Υπολογίστε τα μόρια σας για τις Πανελλαδικές Εξετάσεις εύκολα και γρήγορα με το εργαλείο του Διδακτήριον.",
  path: "/points-calculator",
});

export default async function PointsCalculatorPage() {
  const dbContent = await getPageContent("points-calculator");
  const content = mergeContent(defaultCalculatorContent, dbContent);

  return <PointsCalculatorClient initialContent={content} />;
}
