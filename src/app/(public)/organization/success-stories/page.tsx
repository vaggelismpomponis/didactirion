export const dynamic = "force-dynamic";

import { createPageMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";

export const metadata = createPageMetadata({
  title: "Επιτυχόντες",
  description:
    "Ιστορίες επιτυχίας μαθητών του Διδακτήριον: εισαγωγές σε πανεπιστήμια και σχολές ανά έτος.",
  path: "/organization/success-stories",
});
import { GraduationCap, Trophy, School } from "lucide-react";
import { Badge } from "@/components/ui/badge";

async function getSuccessStories() {
  return await prisma.successStory.findMany({
    orderBy: { year: "desc" },
  });
}

export default async function SuccessStoriesPage() {
  const stories = await getSuccessStories();
  const years = Array.from(new Set(stories.map(s => s.year))).sort((a, b) => b - a);

  return (
    <div className="flex flex-col gap-12 pb-16">
      {/* Header Section */}
      <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 skew-x-12 translate-x-1/4" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
            Οι Επιτυχόντες μας
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Η μεγαλύτερη επιβράβευση για εμάς είναι η επιτυχία των μαθητών μας. Δείτε τις σχολές στις οποίες εισήχθησαν τα προηγούμενα έτη.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4">
        {years.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <School className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-slate-500 italic">Η λίστα των επιτυχόντων θα ενημερωθεί σύντομα.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {years.map((year) => (
              <div key={year} className="space-y-8">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{year}</h2>
                  <div className="h-px bg-slate-200 flex-grow" />
                  <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 hidden sm:inline-flex">
                    Έτος Επιτυχίας
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {stories
                    .filter((s) => s.year === year)
                    .map((story) => (
                      <div 
                        key={story.id} 
                        className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
                      >
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-[#004a99] shrink-0">
                          <GraduationCap className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-900">{story.name}</h4>
                          <p className="text-sm font-semibold text-blue-600">{story.university}</p>
                          <p className="text-xs text-slate-500">{story.faculty}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Motivational Footer */}
      <section className="bg-slate-50 border-y py-20 mt-12">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-bold text-slate-900">Γίνε ο επόμενος επιτυχών!</h2>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Με τη σωστή καθοδήγηση και συστηματική μελέτη, η σχολή των ονείρων σου είναι εφικτή.
          </p>
        </div>
      </section>
    </div>
  );
}
