import { TeacherForm } from "@/components/admin/TeacherForm";

export default function NewTeacherPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Προσθήκη Καθηγητή</h1>
        <p className="text-sm text-slate-500">Συμπληρώστε τα στοιχεία του νέου καθηγητή.</p>
      </div>
      <TeacherForm />
    </div>
  );
}
