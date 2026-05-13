import { PostForm } from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Νέα Ανακοίνωση</h1>
        <p className="text-sm text-slate-500">Δημιουργήστε ένα νέο άρθρο για τον ιστότοπο.</p>
      </div>
      <PostForm />
    </div>
  );
}
