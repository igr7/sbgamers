"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";
import { Search } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full glass rounded-xl px-4 py-3 bg-transparent text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all",
            icon && "pl-12",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export function SearchInput(props: Omit<InputProps, "icon">) {
  return <Input icon={<Search className="w-5 h-5" />} {...props} />;
}
