"use client";

import { useState } from "react";
import { BadgeStatusType, StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Search, Download, ShieldCheck, X, ChevronRight, Clock, ArrowUpRight } from "lucide-react";

interface AuditRow {
  id: string;
  customerName: string;
  virtualAccount: string;
  receivedAmount: number;
  matchedInvoice: string;
  speed: string;
  surplus: number;
  timestamp: string;
  status: BadgeStatusType;
}

export default function TransactionsPage() {
  const [filterQuery, setFilterQuery] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditRow | null>(null);

  const auditLogs: AuditRow[] = [
    {
      id: "TXN-99824102",
      customerName: "Musa Enterprises",
      virtualAccount: "3320012345",
      receivedAmount: 700000,
      matchedInvoice: "INV-2026-04",
      speed: "1.8s",
      surplus: 200000,
      timestamp: "2026-06-27 16:42:11",
      status: "paid",
    },
    {
      id: "TXN-99823914",
      customerName: "Alhaji & Sons",
      virtualAccount: "3320019912",
      receivedAmount: 1200000,
      matchedInvoice: "INV-2026-01",
      speed: "2.3s",
      surplus: 0,
      timestamp: "2026-06-27 16:15:02",
      status: "paid",
    },
    {
      id: "TXN-99821455",
      customerName: "Gbenga Supply",
      virtualAccount: "3320015541",
      receivedAmount: 350000,
      matchedInvoice: "INV-2026-09",
      speed: "3.1s",
      surplus: 0,
      timestamp: "2026-06-27 14:22:55",
      status: "partially_paid",
    },
  ];

  const filteredLogs = auditLogs.filter((log) => log.customerName.toLowerCase().includes(filterQuery.toLowerCase()) || log.id.includes(filterQuery));

  return (
    <div className="space-y-6 w-full relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-pl-ink tracking-tight">Immutable Transaction Audit Trail</h1>
          <p className="text-xs text-pl-ink-3 mt-0.5">Real-time cryptographic logging for inbound virtual account webhooks.</p>
        </div>
        <Button variant="ghost" size="sm" icon={<Download size={14} />}>
          Export CSV
        </Button>
      </div>

      {/* Utility Toolbar */}
      <div className="bg-white p-4 rounded-pl-lg border border-pl-border-dark flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full sm:max-w-md">
          <Search size={16} className="absolute left-3 top-3 text-pl-ink-3" />
          <input
            type="text"
            placeholder="Search Reference or Customer..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full pl-9 pr-4 h-10 border border-pl-border-dark bg-white rounded-pl-sm text-sm outline-none focus:border-pl-primary transition-all"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-pl-ink-3 font-medium">
          <ShieldCheck size={14} className="text-pl-emerald" />
          <span>Verified TLS 1.3 Blocks</span>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-white border border-pl-border-dark rounded-pl-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-pl-surface text-pl-ink-2 uppercase font-bold text-xs border-b border-pl-border-dark">
              <tr>
                <th className="p-4">Reference</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Amount</th>
                <th className="p-4 hidden sm:table-cell">Target Invoice</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pl-border-dark">
              {filteredLogs.map((log) => (
                <tr key={log.id} onClick={() => setSelectedLog(log)} className="hover:bg-pl-surface/40 transition-colors cursor-pointer">
                  <td className="p-4 font-mono font-bold">{log.id}</td>
                  <td className="p-4 font-bold text-pl-ink">{log.customerName}</td>
                  <td className="p-4 font-black">₦{log.receivedAmount.toLocaleString()}</td>
                  <td className="p-4 hidden sm:table-cell text-pl-ink-2">{log.matchedInvoice}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <StatusBadge status={log.status} />
                      <ChevronRight size={16} className="text-pl-ink-3" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-pl-ink/20 backdrop-blur-sm" onClick={() => setSelectedLog(null)} />
          <div className="relative w-full max-w-sm bg-white border-l border-pl-border-dark h-full p-6 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-bold text-lg">Transaction Details</h2>
              <button onClick={() => setSelectedLog(null)} className="p-1 hover:bg-pl-surface rounded">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {[
                { label: "Customer", value: selectedLog.customerName },
                { label: "Account", value: selectedLog.virtualAccount },
                { label: "Timestamp", value: selectedLog.timestamp },
                { label: "Match Speed", value: selectedLog.speed, icon: Clock },
                { label: "Surplus Credit", value: `₦${selectedLog.surplus.toLocaleString()}`, icon: ArrowUpRight },
              ].map((item) => (
                <div key={item.label} className="border-b border-pl-border-dark pb-3">
                  <div className="text-[10px] text-pl-ink-3 uppercase font-bold mb-1">{item.label}</div>
                  <div className="text-sm font-semibold text-pl-ink">{item.value}</div>
                </div>
              ))}
              <div className="pt-4">
                <StatusBadge status={selectedLog.status} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
