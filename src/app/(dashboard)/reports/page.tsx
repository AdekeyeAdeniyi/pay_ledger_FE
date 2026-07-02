"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Download, ArrowUpRight, TrendingUp, Percent, FileSpreadsheet } from "lucide-react";

export default function ReportsPage() {
  const [timeframe, setTimeframe] = useState("30days");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExportSimulatedReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert("MVP Ledger Report compiled successfully. CSV download stream initiated.");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="text-left">
          <h1 className="text-xl font-extrabold text-pl-ink tracking-tight">Ledger Summaries & Exports</h1>
          <p className="text-xs text-pl-ink-3 mt-0.5">Generate audit-grade financial statements for tax tracking.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="h-10 px-3 border border-pl-border-dark bg-white rounded-pl-sm text-xs font-semibold text-pl-ink outline-none w-full sm:w-48">
            <option value="today">Current Cycle (Today)</option>
            <option value="7days">Past 7 Operational Days</option>
            <option value="30days">Past 30 Operational Days</option>
          </select>
          <Button variant="primary" size="sm" className="w-full sm:w-auto" icon={<Download size={15} />} onClick={handleExportSimulatedReport} isLoading={isGenerating}>
            Export Master Log
          </Button>
        </div>
      </div>

      {/* Aggregate Statistics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white border border-pl-border-dark p-5 sm:p-6 rounded-pl-lg shadow-xs text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-pl-ink-3 uppercase tracking-wider">Gross Revenue Inbound</span>
            <TrendingUp size={16} className="text-pl-emerald" />
          </div>
          <p className="text-2xl font-black text-pl-ink tracking-tight">₦4,250,000</p>
          <p className="text-[11px] font-medium text-pl-emerald-dark mt-1">99.8% Match Rate Target Met</p>
        </div>

        <div className="bg-white border border-pl-border-dark p-5 sm:p-6 rounded-pl-lg shadow-xs text-left sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-pl-ink-3 uppercase tracking-wider">Isolated Overpayment Credit</span>
            <ArrowUpRight size={16} className="text-pl-violet" />
          </div>
          <p className="text-2xl font-black text-pl-violet tracking-tight">₦200,000</p>
          <p className="text-[11px] font-medium text-pl-violet mt-1">Pre-allocated client surplus balance</p>
        </div>
      </div>

      {/* Breakdown Subsections */}
      <div className="bg-white border border-pl-border-dark rounded-pl-lg p-5 sm:p-6 shadow-xs text-left">
        <div className="mb-6">
          <h3 className="text-base font-bold text-pl-ink tracking-tight">Available Audit Streams</h3>
          <p className="text-xs text-pl-ink-3 mt-0.5">Download separate ledger sections to reconcile with external corporate tools.</p>
        </div>

        <div className="space-y-4">
          {[
            {
              title: "Nomba Dedicated Virtual Account Route Log",
              desc: "Detailed breakdown of all 148 active NUBAN endpoints and their transactional matching velocity.",
              file: "NUBAN_ROUTING_RAW.csv",
            },

            {
              title: "Customer Ledger Credit Balances Statement",
              desc: "Lists open customer records with unassigned credits created from excess transfer values.",
              file: "SURPLUS_CREDITS_REPORT.csv",
            },
          ].map((item, index) => (
            <div key={index} className="p-4 border border-pl-border-dark rounded-pl-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-pl-surface/30">
              <div className="text-left space-y-1">
                <p className="text-sm font-bold text-pl-ink leading-tight">{item.title}</p>
                <p className="text-xs text-pl-ink-2 max-w-2xl">{item.desc}</p>
                <span className="inline-block font-mono text-[10px] text-pl-ink-3 bg-white px-1.5 py-0.5 rounded border border-pl-border-dark/60">File: {item.file}</span>
              </div>
              <div className="w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-pl-border-dark/50">
                <Button variant="ghost" size="sm" className="w-full sm:w-auto" icon={<FileSpreadsheet size={14} />} onClick={handleExportSimulatedReport}>
                  Download File
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
