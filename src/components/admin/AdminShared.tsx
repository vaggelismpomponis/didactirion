// Reusable admin page header with title, subtitle, and optional action button
interface AdminPageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

import * as React from "react";

export function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl font-heading font-black text-slate-900">{title}</h1>
        {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

// Reusable empty-state component for admin tables
interface AdminEmptyStateProps {
  icon: React.ElementType;
  message: string;
  sub?: string;
}

export function AdminEmptyState({ icon: Icon, message, sub }: AdminEmptyStateProps) {
  return (
    <div className="py-20 flex flex-col items-center gap-3 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300">
        <Icon className="w-7 h-7" />
      </div>
      <p className="font-bold text-slate-600">{message}</p>
      {sub && <p className="text-sm text-slate-400">{sub}</p>}
    </div>
  );
}

// Wrapper for data table cards
export function AdminTableCard({ children, toolbar }: { children: React.ReactNode; toolbar?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {toolbar && (
        <div className="px-4 py-3 border-b border-slate-50 flex items-center gap-3 bg-slate-50/50">
          {toolbar}
        </div>
      )}
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}
