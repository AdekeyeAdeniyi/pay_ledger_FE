"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Bell, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { setAuthToken } from "@/services/authService";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();

  const logOut = () => {
    setAuthToken(null);
    router.push("/login");
  };

  return (
    <div className="h-screen w-screen bg-pl-surface text-pl-ink flex overflow-hidden relative">
      {/* Backdrop Dimmer Overlay for Mobile Drawer view */}
      {isMobileSidebarOpen && <div onClick={() => setIsMobileSidebarOpen(false)} className="fixed inset-0 bg-pl-ink/40 backdrop-blur-xs z-40 md:hidden transition-opacity duration-200" />}

      {/* Unified Navigation Sidebar Container Frame */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 md:sticky md:top-0 h-screen shrink-0 flex flex-col
          ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${isCollapsed ? "md:w-19" : "md:w-65"}
          transition-[width,transform] duration-200 ease-in-out w-65 bg-pl-ink text-white
        `}>
        {/* Mobile close switch button layer inside the dark sidebar skin */}
        <div className="p-4 flex md:hidden justify-end border-b border-white/5 shrink-0">
          <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2 rounded bg-white/5 hover:bg-white/10 text-white cursor-pointer" aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        </div>
      </div>

      {/* Primary Outer Fluid Column Wrapper */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Anchored Operational Header bar */}
        <header className="h-16 bg-white border-b border-pl-border-dark px-4 sm:px-6 flex items-center justify-between shrink-0 z-30 w-full">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 -ml-2 rounded-pl-sm hover:bg-pl-surface text-pl-ink-2 md:hidden transition-colors cursor-pointer"
              aria-label="Open navigation menu">
              <Menu size={20} />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-pl-ink-3">
              <span className="text-pl-ink-2 font-semibold">Workspace</span>
              <span>/</span>
              <span className="capitalize text-pl-primary font-bold">Live Control Ledger</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden xs:flex items-center gap-2 px-2.5 py-1 rounded-pl-pill bg-pl-emerald-light border border-pl-emerald/10 text-[11px] font-bold text-pl-emerald-dark uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-pl-emerald animate-pulse" />
              Nomba Connected
            </div>

            <button className="p-2 rounded-pl-sm hover:bg-pl-surface text-pl-ink-2 transition-colors cursor-pointer relative" aria-label="Notifications">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pl-red" />
            </button>

            <Button size="sm" onClick={logOut}>
              <LogOut size={18} />
            </Button>
          </div>
        </header>

        {/* ISOLATED SCROLLABLE CANVAS CONTAINER */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar">
          <div className="max-w-7xl w-full mx-auto min-w-0 pb-12">{children}</div>
        </main>
      </div>
    </div>
  );
}
