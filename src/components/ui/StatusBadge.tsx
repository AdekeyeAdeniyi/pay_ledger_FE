import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: any[]) => twMerge(clsx(inputs));

export type BadgeStatusType = "draft" | "pending" | "partially_paid" | "paid" | "overpaid" | "cancelled" | "expired";

interface StatusBadgeProps {
  status: BadgeStatusType;
  label?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const configs: Record<BadgeStatusType, string> = {
    draft: "bg-[#F4F5F9] text-pl-ink-2",

    pending: "bg-[#EEF2FF] text-pl-primary-dark",

    partially_paid: "bg-[#FEF6E7] text-[#92620E]",

    paid: "bg-[#E6FBF5] text-[#00946F]",

    overpaid: "bg-[#DCFCE7] text-[#15803D]",

    cancelled: "bg-[#FEE2E2] text-[#B91C1C]",

    expired: "bg-[#F3F4F6] text-[#6B7280]",
  };

  return (
    <span className={cn("inline-flex items-center gap-1 py-0.75 px-2.5 rounded-pl-pill text-xs font-bold uppercase tracking-wider", configs[status])}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
      {label || status}
    </span>
  );
};
