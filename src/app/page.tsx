"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Layers, RefreshCw, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  const [inboundAmount, setInboundAmount] = useState<string>("425000");
  const [matchStatus, setMatchStatus] = useState<"idle" | "processing" | "success" | "surplus">("idle");
  const [expectedObligation] = useState<number>(425000);

  const handleSimulateRoute = (e: React.FormEvent) => {
    e.preventDefault();
    setMatchStatus("processing");

    setTimeout(() => {
      const amt = parseFloat(inboundAmount);
      if (amt === expectedObligation) {
        setMatchStatus("success");
      } else if (amt > expectedObligation) {
        setMatchStatus("surplus");
      } else {
        setMatchStatus("idle");
      }
    }, 1200);
  };

  const parsedAmount = parseFloat(inboundAmount) || 0;
  const surplusCalculation = parsedAmount - expectedObligation;

  return (
    <div className="min-h-screen bg-pl-surface overflow-x-hidden">
      {/* Premium Sticky Top Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-glass border-b border-pl-border-dark h-16">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="font-bold text-lg text-pl-ink tracking-tight">
            Pay<span className="text-pl-primary">Ledger</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-pl-ink-2">
            <a href="#features" className="hover:text-pl-primary transition-colors duration-150">
              Core Mechanics
            </a>
            <a href="#demo" className="hover:text-pl-primary transition-colors duration-150">
              Demo Match Simulation
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-40 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pl-pill bg-pl-primary-light text-pl-primary-dark text-xs font-bold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-pl-primary animate-pulse" />
            Infrastructure Track — Nomba Virtual Accounts
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-pl-ink tracking-tight leading-tight mb-6">
            Automated Receivables <br />
            <span className="text-pl-primary">Reconciliation</span> for Africa
          </h1>

          <p className="text-base md:text-xl text-pl-ink-2 max-w-2xl mb-10 leading-relaxed">
            Assign dedicated static virtual banking endpoints to every single customer. Automatically identify, reconcile, and credit incoming high-volume transfers to ledger obligations under 5
            seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/register" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full" icon={<ArrowRight size={18} />}>
                Deploy Sandbox Shell
              </Button>
            </Link>
            <a href="#features" className="w-full sm:w-auto">
              <Button variant="ghost" size="lg" className="w-full">
                Explore Architecture
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Pillars Grid */}
      <section id="features" className="bg-white py-20 border-t border-pl-border-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-pl-ink tracking-tight mb-4">Built for High-Volume Ledger Accuracy</h2>
            <p className="text-pl-ink-2 text-sm md:text-base">Moving beyond chaotic manual bank statement matching into real-time deterministic financial records.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-pl-lg bg-pl-surface border border-pl-border-dark shadow-xs transition-transform duration-150 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-pl-md bg-pl-primary-light text-pl-primary flex items-center justify-center mb-6">
                <Layers size={24} />
              </div>
              <h3 className="text-lg font-bold text-pl-ink mb-3">Dedicated Virtual Accounts</h3>
              <p className="text-pl-ink-2 text-sm leading-relaxed">Provision unique, dedicated NUBAN endpoints via Nomba for every distributor, merchant, client, or tenant automatically.</p>
            </div>

            <div className="p-8 rounded-pl-lg bg-pl-surface border border-pl-border-dark shadow-xs transition-transform duration-150 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-pl-md bg-pl-emerald-light text-pl-emerald flex items-center justify-center mb-6">
                <RefreshCw size={24} />
              </div>
              <h3 className="text-lg font-bold text-pl-ink mb-3">Instant Settlement Matching</h3>
              <p className="text-pl-ink-2 text-sm leading-relaxed">
                Inbound transactions trigger processing engines immediately. Match payments against specific open invoices, and track overpayments dynamically.
              </p>
            </div>

            <div className="p-8 rounded-pl-lg bg-pl-surface border border-pl-border-dark shadow-xs transition-transform duration-150 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-pl-md bg-pl-violet-light text-pl-violet flex items-center justify-center mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-bold text-pl-ink mb-3">Audit-Grade Ledger Trails</h3>
              <p className="text-pl-ink-2 text-sm leading-relaxed">
                A single source of truth accounting ledger logs all operations, preventing duplicate payment entries and credit matching mismatches.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure Demo Match Simulation Section */}
      <section id="demo" className="w-full bg-pl-ink py-20 px-6 border-t border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-position-[24px_24px]" />

        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-10">
          <div className="max-w-2xl mx-auto">
            <span className="text-[11px] font-bold text-pl-primary uppercase tracking-widest bg-pl-primary/10 px-2.5 py-1 rounded-full border border-pl-primary/20">Engine Playground</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-3">Simulate Inbound Clearing Vectors</h2>
            <p className="text-xs sm:text-sm text-white/60 mt-1.5">Test how the virtual routing mesh instantly parses high-velocity NUBAN deposits against ledger invariants.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white/2 border border-white/10 p-5 sm:p-8 rounded-pl-lg backdrop-blur-md items-stretch text-left">
            {/* Controls Config Column */}
            <form onSubmit={handleSimulateRoute} className="md:col-span-5 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-white/80 uppercase tracking-wider mb-2">Expected Invoice Balance</label>
                  <div className="h-11 px-3 bg-white/5 border border-white/10 rounded-pl-sm flex items-center text-sm font-mono font-bold text-white/50 select-none">₦425,000.00</div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/80 uppercase tracking-wider mb-2">Simulated Inbound Transfer Value</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-sm font-bold text-white/40">₦</span>
                    <input
                      type="number"
                      value={inboundAmount}
                      onChange={(e) => {
                        setInboundAmount(e.target.value);
                        if (matchStatus !== "idle") setMatchStatus("idle");
                      }}
                      placeholder="Enter deposit amount"
                      className="w-full pl-7 pr-4 h-11 bg-white/10 border border-white/20 rounded-pl-sm font-mono text-sm font-bold text-white focus:outline-none focus:border-pl-primary transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setInboundAmount("425000");
                        setMatchStatus("idle");
                      }}
                      className="text-[10px] font-bold px-2 py-0.5 bg-white/5 hover:bg-white/10 rounded text-white/70 border border-white/5 cursor-pointer">
                      Exact Match
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setInboundAmount("625000");
                        setMatchStatus("idle");
                      }}
                      className="text-[10px] font-bold px-2 py-0.5 bg-pl-violet/20 hover:bg-pl-violet/30 rounded text-pl-violet border border-pl-violet/30 cursor-pointer">
                      Overpayment Trigger
                    </button>
                  </div>
                </div>
              </div>

              <Button variant="primary" type="submit" className="w-full h-11 justify-center mt-4 md:mt-0" isLoading={matchStatus === "processing"} icon={<ArrowRight size={15} />}>
                Fire Routing Hook
              </Button>
            </form>

            {/* Visual Divider Node */}
            <div className="hidden md:flex md:col-span-1 items-center justify-center relative">
              <div className="w-px h-full bg-white/10 absolute left-1/2 -translate-x-1/2" />
              <div className="w-7 h-7 rounded-full bg-pl-ink border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/40 relative z-10">VS</div>
            </div>

            {/* Core Pipeline Visual State Engine Display */}
            <div className="md:col-span-6 bg-black/20 border border-white/5 rounded-pl-sm p-5 flex flex-col justify-between min-h-55">
              <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest font-mono">Real-Time Node Clearing Status</p>

                {matchStatus === "idle" && (
                  <div className="mt-6 space-y-2 animate-fade-in">
                    <div className="flex items-center gap-2 text-white/70">
                      <RefreshCw size={15} className="text-white/30 animate-spin [animation-duration:8s]" />
                      <p className="text-xs font-semibold">Awaiting transfer initialization stream...</p>
                    </div>
                    <p className="text-[11px] text-white/40 max-w-sm">Modify parameters on the left and submit payload to process allocation via Nomba.</p>
                  </div>
                )}

                {matchStatus === "processing" && (
                  <div className="mt-6 space-y-3 animate-fade-in">
                    <div className="flex items-center gap-2.5 text-pl-primary">
                      <RefreshCw size={15} className="animate-spin" />
                      <p className="text-xs font-bold uppercase tracking-wider">Reconciling ledger boundaries</p>
                    </div>
                    <div className="space-y-1 font-mono text-[10px] text-white/40 bg-white/5 p-2.5 rounded border border-white/5">
                      <p>&gt; Validating matching address checksums...</p>
                      <p>&gt; Inbound value detected: ₦{parsedAmount.toLocaleString()}</p>
                    </div>
                  </div>
                )}

                {matchStatus === "success" && (
                  <div className="mt-5 space-y-4 animate-fade-in">
                    <div className="flex items-center gap-2 text-pl-emerald">
                      <CheckCircle2 size={18} className="shrink-0" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide leading-none">100% Core Match Cleared</p>
                        <p className="text-[10px] text-white/50 mt-1">Invoice obligations tracking resolved perfectly.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-left font-mono text-[11px] bg-pl-emerald/10 border border-pl-emerald/20 p-3 rounded text-white/90">
                      <div>
                        <span className="block text-[9px] text-white/40 uppercase font-sans font-bold">Treasury Route</span>
                        ₦425,000.00
                      </div>
                      <div>
                        <span className="block text-[9px] text-white/40 uppercase font-sans font-bold">Surplus Credit</span>
                        ₦0.00
                      </div>
                    </div>
                  </div>
                )}

                {matchStatus === "surplus" && (
                  <div className="mt-5 space-y-4 animate-fade-in">
                    <div className="flex items-center gap-2 text-pl-violet">
                      <AlertCircle size={18} className="shrink-0" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide leading-none">Asymmetric Overpayment Isolated</p>
                        <p className="text-[10px] text-white/50 mt-1">Base invoice handled; overflow safely partitioned.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-left font-mono text-[11px] bg-pl-violet/10 border border-pl-violet/20 p-3 rounded text-white/90">
                      <div>
                        <span className="block text-[9px] text-white/40 uppercase font-sans font-bold">Settled Ledger</span>
                        ₦425,000.00
                      </div>
                      <div>
                        <span className="block text-[9px] text-pl-violet font-sans font-bold uppercase">Customer Vault</span>
                        +₦{surplusCalculation.toLocaleString()}.00
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-white/40 border-t border-white/5 pt-3 mt-4">
                <ShieldCheck size={12} className="text-pl-primary" />
                <span>Production validation pipeline matching engine standard</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Structural Footer */}
      <footer className="bg-pl-ink text-white/50 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm">&copy; 2026 PayLedger Financial Infrastructure Engine. Ready for Hackathon Review.</div>
          <div className="flex gap-6 text-xs font-semibold uppercase tracking-wider text-white/30">
            <span>Nomba Core Layer</span>
            <span>&middot;</span>
            <span>REST API Services</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
