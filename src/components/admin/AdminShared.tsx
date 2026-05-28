// Reusable admin page header with title, subtitle, and optional action button
interface AdminPageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  action?: React.ReactNode;
}

import * as React from "react";

export function AdminPageHeader({ title, description, badge, action }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-start gap-3">
        {/* Left accent bar */}
        <div className="w-1 h-10 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full shrink-0 mt-0.5" />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-heading font-black text-slate-900">{title}</h1>
            {badge && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-blue-50 text-blue-700 border border-blue-100">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="text-[13px] text-slate-500 mt-0.5">{description}</p>
          )}
        </div>
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
  action?: React.ReactNode;
}

export function AdminEmptyState({ icon: Icon, message, sub, action }: AdminEmptyStateProps) {
  return (
    <div className="py-24 flex flex-col items-center gap-4 text-center">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300">
          <Icon className="w-8 h-8" />
        </div>
        <div className="absolute -inset-1 rounded-2xl bg-slate-100 -z-10 blur-sm opacity-60" />
      </div>
      <div>
        <p className="font-bold text-slate-700 text-[15px]">{message}</p>
        {sub && <p className="text-sm text-slate-400 mt-1">{sub}</p>}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

// Wrapper for data table cards with optional toolbar and footer
export function AdminTableCard({
  children,
  toolbar,
  footer,
}: {
  children: React.ReactNode;
  toolbar?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {toolbar && (
        <div className="px-5 py-3 border-b border-slate-50 flex items-center gap-3 bg-slate-50/40">
          {toolbar}
        </div>
      )}
      <div className="overflow-x-auto">{children}</div>
      {footer && (
        <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/30 text-[12px] text-slate-400">
          {footer}
        </div>
      )}
    </div>
  );
}
