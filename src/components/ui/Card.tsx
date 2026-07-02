import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return <div className={cn("border-pl-border-dark rounded-pl-lg border border-pl-border-dark bg-white shadow-sm p-5 w-full", className)}>{children}</div>;
}
