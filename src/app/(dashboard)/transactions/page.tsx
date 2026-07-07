"use client";

import { useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { StatusBadge } from "@/components/ui/StatusBadge";
import PreLoader from "@/components/modal/Preloader";
import { Button } from "@/components/ui/Button";
import { Download, Search, ShieldCheck, X } from "lucide-react";

export default function TransactionsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useTransactions(page);
  const [selectedLog, setSelectedLog] = useState<any>(null);

  if (isLoading) return <PreLoader />;

  const { transactions } = data;

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-pl-ink tracking-tight">Immutable Transaction Audit Trail</h1>

          <p className="text-xs text-pl-ink-3 mt-0.5">Real-time cryptographic logging for inbound virtual account webhooks.</p>
        </div>

        <Button variant="ghost" size="sm" icon={<Download size={14} />}>
          Export CSV
        </Button>
      </div>

      <div className="bg-white border rounded-pl-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-pl-surface text-xs font-bold uppercase border-b">
            <tr>
              <th className="p-4">Target Invoice</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Amount</th>
              <th className="p-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {/* 1. Ensure transactions exist and check its length */}
            {!data?.transactions || data.transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-pl-ink-3">
                  No transactions found.
                </td>
              </tr>
            ) : (
              data.transactions.map((txn: any) => (
                <tr key={txn.id} onClick={() => setSelectedLog(txn)} className="cursor-pointer hover:bg-pl-surface/40">
                  <td className="p-4 font-mono font-bold text-pl-ink-2">{txn.invoice?.invoiceNumber ?? "---"}</td>

                  <td className="p-4 font-bold text-pl-ink">{txn.customer?.name ?? "Unknown"}</td>

                  <td className="p-4 font-black">₦{parseFloat(txn.creditAmount || 0).toLocaleString()}</td>

                  <td className="p-4 text-right">
                    <StatusBadge status={txn.invoice?.status?.toLowerCase() ?? "pending"} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Drawer - Mapping dynamic data */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-pl-ink/20 backdrop-blur-sm" onClick={() => setSelectedLog(null)} />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-sm bg-white border-l border-pl-border-dark h-full p-6 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-bold text-lg text-pl-ink">Transaction Details</h2>
              <button onClick={() => setSelectedLog(null)} className="p-2 hover:bg-pl-surface rounded-full transition-colors text-pl-ink-3 hover:text-pl-ink">
                <X size={20} />
              </button>
            </div>

            {/* Main Content */}
            <div className="space-y-6 grow overflow-y-auto">
              {/* Status Badge Top Level */}
              <div className="flex justify-between items-center bg-pl-surface p-3 rounded-pl-sm">
                <span className="text-xs font-bold text-pl-ink-2">Current Status</span>
                <StatusBadge status={selectedLog.invoice?.status?.toLowerCase() || "pending"} />
              </div>

              {[
                { label: "Reference", value: selectedLog.reference, font: "font-mono" },
                { label: "Entry Type", value: selectedLog.entryType.replace(/_/g, " ") },
                { label: "Customer", value: selectedLog.customer?.name },
                { label: "Phone", value: selectedLog.customer?.phone },
                { label: "Credit Amount", value: `₦${parseFloat(selectedLog.creditAmount).toLocaleString()}` },
                { label: "Balance Due", value: selectedLog.invoice?.balanceDue ? `₦${parseFloat(selectedLog.invoice.balanceDue).toLocaleString()}` : "N/A" },
              ].map((item) => (
                <div key={item.label} className="border-b border-pl-border-dark pb-3">
                  <div className="text-[10px] text-pl-ink-3 uppercase font-bold mb-1">{item.label}</div>
                  <div className={`text-sm font-semibold text-pl-ink ${item.font || ""}`}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Footer Action */}
            <div className="mt-6 pt-6 ">
              <Button variant="primary" className="w-full" onClick={() => setSelectedLog(null)}>
                Close Details
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
