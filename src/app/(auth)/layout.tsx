import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-pl-surface flex flex-col md:grid md:grid-cols-12 overflow-hidden">
      {/* Sidebar Informational Branding Frame */}
      <div className="hidden md:flex md:col-span-5 bg-pl-ink p-12 flex-col justify-between text-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(46,91,255,0.12),transparent)] pointer-events-none" />

        <div className="font-bold text-xl text-white tracking-tight z-10">
          Pay<span className="text-pl-primary">Ledger</span>
        </div>

        <div className="z-10 space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-pl-primary">Nomba Core Infrastructure</p>
          <h2 className="text-2xl font-bold text-white tracking-tight leading-snug">Automate invoice tracking and bank transfer statement matching for good.</h2>
          <div className="h-0.5 w-12 bg-pl-primary" />
          <p className="text-sm text-pl-ink-3 leading-relaxed">A real-time reconciliation engine built to process high-volume accounting workflows with zero administrative manual bottlenecks.</p>
        </div>

        <div className="text-xs text-pl-ink-3 z-10">Encrypted Security Session Gateway &middot; TLS 1.3</div>
      </div>

      {/* Render Target Content Frame */}
      <main className="flex-1 md:col-span-7 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md bg-white border border-pl-border-dark rounded-pl-lg p-8 md:p-10 shadow-md">{children}</div>
      </main>
    </div>
  );
}
