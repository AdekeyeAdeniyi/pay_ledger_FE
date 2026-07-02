"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileText, ArrowLeftRight, BarChart3, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: any[]) => twMerge(clsx(inputs));

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const pathname = usePathname();

  const navigationItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Customers", path: "/customers", icon: Users },
    { name: "Invoices", path: "/invoices", icon: FileText },
    { name: "Transactions", path: "/transactions", icon: ArrowLeftRight },
    { name: "Reports", path: "/reports", icon: BarChart3 },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <aside className={cn("flex flex-col h-full bg-pl-ink text-white/70 border-r border-white/10 select-none transition-all duration-200 ease-in-out w-full")}>
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-white/5 shrink-0">
        {!isCollapsed && (
          <div className="font-bold text-base text-white tracking-tight animate-fade-in">
            Pay<span className="text-pl-primary">Ledger</span>
          </div>
        )}

        {/* Hidden on mobile, toggle button exclusively for desktop viewports */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn("hidden md:block p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer", isCollapsed ? "mx-auto" : "ml-auto")}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation Nodes */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navigationItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          return (
            <Link
              key={item.name}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-3 h-11 rounded-lg text-sm font-medium transition-all relative group",
                isActive ? "text-white bg-white/10" : "hover:text-white hover:bg-white/5",
                isCollapsed && "md:justify-center md:px-0",
              )}>
              <item.icon size={18} className={cn(isActive ? "text-pl-primary" : "text-white/50 group-hover:text-white", "shrink-0")} />
              {!isCollapsed && <span className="whitespace-nowrap opacity-100 transition-opacity duration-150 md:block">{item.name}</span>}
              {/* Desktop collapsed tooltips */}
              {isCollapsed && (
                <span className="hidden md:block absolute left-full ml-2 px-2 py-1 bg-pl-ink text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md border border-white/10">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Dedicated Workspace Summary */}
      <div className="p-4 border-t border-white/5 bg-white/2 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-pl-primary flex items-center justify-center font-bold text-xs text-white shrink-0">HQ</div>
          {!isCollapsed && (
            <div className="overflow-hidden text-left animate-fade-in">
              <p className="text-xs font-semibold text-white truncate">Musa Enterprises</p>
              <p className="text-[10px] text-pl-ink-3 truncate">MVP Environment</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
