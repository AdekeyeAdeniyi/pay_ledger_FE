import { Loader2 } from "lucide-react";

export default function PreLoader() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-pl-background">
      <div className="w-full max-w-sm rounded-pl-xl border border-pl-border-dark bg-white shadow-sm p-8">
        <div className="flex flex-col items-center">
          {/* Animated Icon */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-pl-primary/10 animate-ping" />

            <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-pl-border-dark bg-white">
              <Loader2 className="h-8 w-8 animate-spin text-pl-primary" />
            </div>
          </div>

          {/* Title */}
          <h2 className="mt-6 text-lg font-black text-pl-ink">Loading Data</h2>

          {/* Subtitle */}
          <p className="mt-2 text-center text-sm text-pl-ink-3 leading-relaxed">Fetching and preparing your workspace.</p>
          <span className="mt-3 text-xs font-semibold uppercase tracking-wider text-pl-ink-3">Please wait...</span>
        </div>
      </div>
    </div>
  );
}
