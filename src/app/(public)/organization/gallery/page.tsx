import { Image as ImageIcon } from "lucide-react";

const galleryImages = [
  { url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070", title: "Αίθουσα Διδασκαλίας" },
  { url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071", title: "Ομαδική Μελέτη" },
  { url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070", title: "Ψηφιακά Εργαλεία" },
  { url: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=2070", title: "Βιβλιοθήκη" },
  { url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070", title: "Εργαστήριο" },
  { url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070", title: "Σεμινάριο" },
];

export default function GalleryPage() {
  return (
    <div className="flex flex-col gap-12 pb-16">
      {/* Header Section */}
      <section className="bg-[#004a99] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
            Φωτογραφικό Υλικό
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Περιηγηθείτε στις εγκαταστάσεις μας και δείτε στιγμιότυπα από την καθημερινή ζωή στο φροντιστήριο.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {galleryImages.map((image, i) => (
            <div 
              key={i} 
              className="group relative aspect-square rounded-3xl overflow-hidden shadow-lg border border-slate-100 cursor-pointer"
            >
              <img 
                src={image.url} 
                alt={image.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                <div className="text-white">
                  <p className="text-lg font-bold">{image.title}</p>
                  <p className="text-sm text-slate-200">Κάντε κλικ για μεγέθυνση</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Placeholder for no images */}
      {galleryImages.length === 0 && (
        <div className="container mx-auto px-4 py-20 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Η συλλογή είναι κενή</h3>
          <p className="text-slate-500">Πολύ σύντομα θα προστεθεί νέο φωτογραφικό υλικό.</p>
        </div>
      )}
    </div>
  );
}
