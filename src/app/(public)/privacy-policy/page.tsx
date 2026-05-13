import { Shield, Lock, Eye, Database, Globe, Cookie, Handshake, Info } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col gap-12 pb-16">
      {/* Header Section */}
      <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 skew-x-12 translate-x-1/4" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Shield className="w-16 h-16 text-blue-500 mx-auto mb-6" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
            Πολιτική Απορρήτου
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Δεσμευόμαστε για την προστασία και τον σεβασμό της ιδιωτικότητάς σας.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 max-w-5xl">
        <div className="bg-white p-6 sm:p-10 md:p-16 rounded-3xl border border-slate-100 shadow-sm space-y-12">
          
          {/* 1. What information */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Database className="w-6 h-6" />
              <h2 className="text-2xl font-bold text-slate-900">Τι πληροφορίες συλλέγουμε;</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Συλλέγουμε πληροφορίες από εσάς κατά την εγγραφή σας στον ιστότοπό μας, την παραγγελία ή τη συμπλήρωση μιας φόρμας.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Κατά την παραγγελία ή την εγγραφή στον ιστότοπό μας, κατά περίπτωση, ενδέχεται να σας ζητηθεί να εισαγάγετε το: όνομα, τη διεύθυνση e-mail ή τη διεύθυνση αλληλογραφίας σας.
            </p>
          </div>

          {/* 2. Why we use it */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-primary">
              <Info className="w-6 h-6" />
              <h2 className="text-2xl font-bold text-slate-900">Για ποιο λόγο χρησιμοποιούμε τις πληροφορίες σας;</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Οποιαδήποτε από τις πληροφορίες που συλλέγουμε από εσάς μπορεί να χρησιμοποιηθεί με έναν από τους ακόλουθους τρόπους:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Εξατομίκευση", desc: "Οι πληροφορίες σας μας βοηθούν να ανταποκριθούμε καλύτερα στις ατομικές σας ανάγκες." },
                { title: "Βελτίωση Ιστότοπου", desc: "Προσπαθούμε συνεχώς να βελτιώνουμε τις προσφορές μας βάσει των σχολίων που λαμβάνουμε." },
                { title: "Εξυπηρέτηση Πελατών", desc: "Μας βοηθούν να ανταποκριθούμε πιο αποτελεσματικά στα αιτήματα υποστήριξης." },
                { title: "Επεξεργασία Συναλλαγών", desc: "Τα στοιχεία σας δεν θα πωληθούν ή δοθούν σε άλλη εταιρεία χωρίς τη συγκατάθεσή σας." },
                { title: "Διαχείριση Δυνατοτήτων", desc: "Για τη διαχείριση διαγωνισμών, ερευνών ή άλλων δυνατοτήτων του ιστοτόπου." },
                { title: "Αποστολή Email", desc: "Για ενημερώσεις σχετικά με την παραγγελία σας ή εταιρικά νέα (με δυνατότητα διαγραφής)." }
              ].map((item, i) => (
                <li key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2">
                  <span className="font-bold text-slate-900">{item.title}</span>
                  <span className="text-sm text-slate-500">{item.desc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Protection */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Lock className="w-6 h-6" />
              <h2 className="text-2xl font-bold text-slate-900">Πώς προστατεύουμε τις πληροφορίες σας;</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Εφαρμόζουμε μια ποικιλία μέτρων ασφαλείας για να διατηρήσουμε την ασφάλεια των προσωπικών σας στοιχείων όταν κάνετε μια παραγγελία ή αποκτάτε πρόσβαση σε αυτά.
            </p>
            <p className="text-slate-600 leading-relaxed bg-blue-50 p-6 rounded-2xl border border-blue-100">
              Σας προσφέρουμε τη χρήση ενός ασφαλούς server. Όλες οι παρεχόμενες ευαίσθητες πληροφορίες μεταδίδονται μέσω της τεχνολογίας **Secure Socket Layer (SSL)** και στη συνέχεια κρυπτογραφούνται στη βάση δεδομένων των παρόχων πληρωμών, προσβάσιμα μόνο από εξουσιοδοτημένα άτομα που δεσμεύονται για την εμπιστευτικότητα των πληροφοριών.
            </p>
          </div>

          {/* 4. Cookies */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Cookie className="w-6 h-6" />
              <h2 className="text-2xl font-bold text-slate-900">Χρησιμοποιούμε cookies;</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Ναι. Τα cookie είναι μικρά αρχεία που μεταφέρει ένας ιστότοπος στον σκληρό δίσκο του υπολογιστή σας μέσω του προγράμματος περιήγησης (εάν το επιτρέπετε) που επιτρέπει στα συστήματά μας να αναγνωρίζουν το πρόγραμμα περιήγησής σας και να θυμούνται ορισμένες πληροφορίες.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Χρησιμοποιούμε cookies για να μας βοηθήσουν να θυμηθούμε και να επεξεργαστούμε τα στοιχεία στο καλάθι αγορών σας, να κατανοήσουμε τις προτιμήσεις σας για μελλοντικές επισκέψεις και να παρακολουθούμε τις διαφημίσεις.
            </p>
          </div>

          {/* 5. Third Parties */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Handshake className="w-6 h-6" />
              <h2 className="text-2xl font-bold text-slate-900">Αποκαλύπτουμε πληροφορίες σε τρίτους;</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Δεν πουλάμε, ανταλλάσσουμε ή με άλλο τρόπο μεταβιβάζουμε σε τρίτους τα προσωπικά σας στοιχεία. Αυτό δεν περιλαμβάνει αξιόπιστα τρίτα μέρη που μας βοηθούν στη λειτουργία του ιστότοπού μας ή στην εξυπηρέτησή σας, εφόσον συμφωνούν να διατηρήσουν αυτές τις πληροφορίες εμπιστευτικές.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Ενδέχεται επίσης να κοινοποιήσουμε τα στοιχεία σας όταν πιστεύουμε ότι η κυκλοφορία είναι κατάλληλη για συμμόρφωση με το νόμο, επιβολή των πολιτικών του ιστότοπού μας ή προστασία των δικαιωμάτων και της ασφάλειας.
            </p>
          </div>

          {/* 6. Links & Online only */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Globe className="w-5 h-5" />
                <h3 className="font-bold text-slate-900">Σύνδεσμοι τρίτων</h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Ενδέχεται να προσφέρουμε προϊόντα τρίτων στον ιστότοπό μας. Αυτοί οι ιστότοποι έχουν ξεχωριστές πολιτικές απορρήτου και δεν φέρουμε ευθύνη για το περιεχόμενό τους.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Eye className="w-5 h-5" />
                <h3 className="font-bold text-slate-900">Μόνο διαδικτυακή πολιτική</h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Αυτή η πολιτική απορρήτου ισχύει μόνο για πληροφορίες που συλλέγονται μέσω του ιστότοπού μας και όχι για πληροφορίες που συλλέγονται εκτός σύνδεσης.
              </p>
            </div>
          </div>

          {/* 7. Consent */}
          <div className="pt-10 text-center border-t border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Η συγκατάθεσή σας</h2>
            <p className="text-slate-600 leading-relaxed mb-8">
              Χρησιμοποιώντας τον ιστότοπό μας, αποδέχεστε την πολιτική απορρήτου μας.
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 text-green-700 rounded-full font-bold text-sm border border-green-100">
              <Shield className="w-4 h-4" />
              Ενημερωμένο Μάιος 2026
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
