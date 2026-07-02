import React, { useId } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: any[]) => twMerge(clsx(inputs));

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, label, hint, error, type = "text", ...props }, ref) => {
  const generatedId = useId();

  return (
    <div className="w-full flex flex-col gap-3">
      {label && (
        <label htmlFor={generatedId} className="block text-xs font-medium text-pl-ink-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={generatedId}
          ref={ref}
          type={type}
          aria-invalid={!!error}
          aria-describedby={error ? `${generatedId}-error` : hint ? `${generatedId}-hint` : undefined}
          className={cn(
            "w-full px-3.5 h-10 border border-pl-ink/10 rounded-pl-sm text-sm text-pl-ink bg-white outline-none transition-all duration-150 focus:border-pl-primary focus:ring-3 focus:ring-pl-primary/12",
            error && "border-pl-red focus:border-pl-red focus:ring-pl-red/12",
            className,
          )}
          {...props}
        />
      </div>
      {error && (
        <p id={`${generatedId}-error`} className="text-xs text-pl-red mt-1 font-medium">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${generatedId}-hint`} className="text-xs text-pl-ink-3 mt-1">
          {hint}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";
