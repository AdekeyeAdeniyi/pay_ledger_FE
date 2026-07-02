import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: any[]) => twMerge(clsx(inputs));

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger" | "white" | "outline-white";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, className, variant = "primary", size = "md", isLoading, icon, disabled, ...props }) => {
  const baseStyle =
    "inline-flex items-center justify-center gap-2 font-medium cursor-pointer transition-all duration-150 rounded-pl-pill border-none whitespace-nowrap outline-none disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.985] hover:scale-[1.015]";

  const variants = {
    primary: "bg-pl-primary text-white hover:bg-pl-primary-dark shadow-sm",
    ghost: "bg-transparent text-pl-primary border border-pl-primary hover:bg-pl-primary-light",
    danger: "bg-pl-red text-white hover:bg-red-700",
    white: "bg-white text-pl-primary font-semibold hover:bg-gray-50",
    "outline-white": "bg-transparent text-white border border-white/30 hover:bg-white/10",
  };

  const sizes = {
    sm: "h-8 px-[14px] text-xs",
    md: "h-10 px-5 text-sm",
    lg: "h-12 px-7 text-[15px]",
  };

  return (
    <button className={cn(baseStyle, variants[variant], sizes[size], className)} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        icon
      )}
      {children}
    </button>
  );
};
