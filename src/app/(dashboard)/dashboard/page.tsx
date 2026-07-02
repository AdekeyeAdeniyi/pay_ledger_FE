"use client";

import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight, FileText, Layers, Users, CheckCircle2, RefreshCw } from "lucide-react";

export default function DashboardOverviewPage() {
  const metricSummaries = [
    { title: "Total Collections", value: "₦4,250,000", change: "+24.5%", icon: ArrowUpRight, color: "text-pl-emerald", bg: "bg-pl-emerald-light" },
    { title: "Receivables", value: "₦1,120,000", change: "14 Invoices", icon: FileText, color: "text-pl-amber", bg: "bg-pl-amber-light" },
    { title: "Excess Credits", value: "₦380,000", change: "Auto Guarded", icon: Layers, color: "text-pl-violet", bg: "bg-pl-violet-light" },
    { title: "Active Routers", value: "148", change: "99.8% Match", icon: Users, color: "text-pl-primary", bg: "bg-pl-primary-light" },
  ];

  const recentReconciliations = [
    {
      id: "REC-0941",
      customer: "Musa Enterprises",
      account: "3320012345",
      amount: "₦700,000",
      target: "INV-2026-04",
      matchedWith: "₦500,000 Invoice",
      balanceOffset: "₦200,000 Credit",
      time: "2m ago",
      status: "paid" as const,
    },
    {
      id: "REC-0940",
      customer: "Alhaji & Sons",
      account: "3320019912",
      amount: "₦1,200,000",
      target: "INV-2026-01",
      matchedWith: "Exact Match",
      balanceOffset: "₦0 Close",
      time: "14m ago",
      status: "paid" as const,
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Dashboard Headline */}
      <div className="flex flex-col items-end md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-pl-ink tracking-tight mb-1">Financial Operations Ledger</h1>
          <p className="text-xs sm:text-sm text-pl-ink-2">Real-time status of collections routing and settlement matching.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" icon={<RefreshCw size={14} />}>
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button variant="primary" size="sm" icon={<Layers size={14} />}>
            Issue NUBAN Router
          </Button>
        </div>
      </div>

      {/* Aggregate Matrix - Adaptive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-6">
        {metricSummaries.map((card, idx) => (
          <div key={idx} className="bg-white border border-pl-border-dark p-4 sm:p-6 rounded-pl-lg shadow-xs">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-[10px] sm:text-xs font-semibold text-pl-ink-2 truncate">{card.title}</span>
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-pl-md ${card.bg} ${card.color} flex items-center justify-center shrink-0`}>
                <card.icon size={14} />
              </div>
            </div>
            <p className="text-lg sm:text-2xl font-black text-pl-ink tracking-tight mb-0.5">{card.value}</p>
            <p className="text-[10px] sm:text-[11px] font-medium text-pl-ink-3">{card.change}</p>
          </div>
        ))}
      </div>

      {/* Full Width Reconciliation Feed */}
      <div className="bg-white border border-pl-border-dark rounded-pl-lg p-4 sm:p-6 shadow-xs">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-pl-ink tracking-tight">Nomba Event Reconciliation Feed</h2>
            <p className="text-xs text-pl-ink-3">Live stream of verified inbound bank transfers.</p>
          </div>
          <span className="w-fit text-[10px] uppercase font-extrabold tracking-wider bg-pl-primary-light text-pl-primary px-2.5 py-1 rounded-pl-pill">WebSocket Active</span>
        </div>

        <div className="divide-y divide-pl-border-dark">
          {recentReconciliations.map((log) => (
            <div key={log.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-pl-sm bg-pl-surface flex items-center justify-center text-pl-primary shrink-0">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-pl-ink">
                    {log.customer} <span className="text-xs font-normal text-pl-ink-3">({log.account})</span>
                  </p>
                  <p className="text-xs text-pl-ink-2 mt-0.5">
                    Received <span className="font-semibold text-pl-ink">{log.amount}</span> &middot; Assigned to{" "}
                    <span className="font-mono text-pl-primary bg-pl-primary-light px-1 rounded text-[11px]">{log.target}</span>
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-pl-ink-3">
                    <span className="bg-pl-surface px-1.5 py-0.5 rounded font-medium text-pl-ink-2">{log.matchedWith}</span>
                    <span className="text-pl-violet font-semibold">{log.balanceOffset}</span>
                  </div>
                </div>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                <StatusBadge status={log.status} />
                <span className="text-[10px] text-pl-ink-3 font-mono">{log.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
