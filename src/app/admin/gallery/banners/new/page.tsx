import { BannerForm } from "@/components/admin/BannerForm";

export default function NewBannerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Νέο Banner</h1>
        <p className="text-sm text-slate-500">Προσθήκη νέου banner στην αρχική σελίδα.</p>
      </div>
      <BannerForm />
    </div>
  );
}
