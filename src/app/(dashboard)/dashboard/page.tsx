"use client";
import { useDashboardOverview } from "@/hooks/useDashboard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight, FileText, Layers, Users, CheckCircle2, RefreshCw } from "lucide-react";
import { formatCurrency } from "@/lib/formatCurrency";
import PreLoader from "@/components/modal/Preloader";

export default function DashboardOverviewPage() {
  const { data, isLoading, refetch } = useDashboardOverview();

  if (isLoading) return <PreLoader />;

  const { overview, latestInvoices } = data;

  const metricSummaries = [
    {
      title: "Total Invoice Value",
      value: formatCurrency(overview.totalInvoiceValue),
      change: `${overview.totalInvoices} Invoices`,
      icon: FileText,
      color: "text-pl-primary",
      bg: "bg-pl-primary-light",
    },
    {
      title: "Total Amount Collected",
      value: formatCurrency(overview.totalAmountCollected),
      change: "Payments Received",
      icon: ArrowUpRight,
      color: "text-pl-emerald",
      bg: "bg-pl-emerald-light",
    },
    {
      title: "Outstanding Balance",
      value: formatCurrency(overview.outstandingBalance),
      change: "Pending Payments",
      icon: Layers,
      color: "text-pl-amber",
      bg: "bg-pl-amber-light",
    },
    {
      title: "Excess Credits",
      value: formatCurrency(overview.excessCreditReceived),
      change: "Available Credits",
      icon: Layers,
      color: "text-pl-violet",
      bg: "bg-pl-violet-light",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col items-end md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-pl-ink tracking-tight mb-1">Financial Operations Ledger</h1>
          <p className="text-xs sm:text-sm text-pl-ink-2">Real-time status of collections routing and settlement matching.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => refetch()} icon={<RefreshCw size={14} />}>
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Metrics */}
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

      {/* Reconciliation Feed */}
      <div className="bg-white border border-pl-border-dark rounded-pl-lg p-4 sm:p-6 shadow-xs">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-pl-ink tracking-tight">Nomba Event Reconciliation Feed</h2>
            <p className="text-xs text-pl-ink-3">Live stream of verified inbound bank transfers.</p>
          </div>
        </div>

        <div className="divide-y divide-pl-border-dark">
          {latestInvoices.map((inv: any) => (
            <div key={inv.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-pl-sm bg-pl-surface flex items-center justify-center text-pl-primary shrink-0">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-pl-ink">{inv.customer.name}</p>
                  <p className="text-xs text-pl-ink-2 mt-0.5">
                    Inv: <span className="font-mono">{inv.invoiceNumber}</span> &middot; Due: {new Date(inv.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <StatusBadge status={inv.status.toLowerCase()} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
