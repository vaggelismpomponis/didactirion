import { PopupForm } from "@/components/admin/PopupForm";

export default function NewPopupPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Νέο Popup</h1>
        <p className="text-sm text-slate-500">Δημιουργήστε ένα νέο αναδυόμενο παράθυρο ανακοινώσεων.</p>
      </div>
      <PopupForm />
    </div>
  );
}
