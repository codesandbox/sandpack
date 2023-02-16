import cn from "clsx";
import type { ComponentProps, ReactNode } from "react";
import React, { forwardRef } from "react";

type InputProps = ComponentProps<"input"> & { suffix?: ReactNode };

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, suffix, ...props }, forwardedRef) => (
    <div className="nx-relative nx-flex nx-items-center nx-text-gray-900 contrast-more:nx-text-gray-800 dark:nx-text-gray-300 contrast-more:dark:nx-text-gray-300 md:nx-w-64">
      <input
        ref={forwardedRef}
        className={cn(
          className,
          "nx-block nx-w-full nx-appearance-none nx-rounded-lg nx-px-3 nx-py-2 nx-transition-colors",
          "nx-text-base nx-leading-tight md:nx-text-sm",
          "nx-bg-black/[.03] dark:nx-bg-gray-50/10",
          "focus:nx-bg-white dark:focus:nx-bg-dark",
          "placeholder:nx-text-gray-400 dark:placeholder:nx-text-gray-500",
          "contrast-more:nx-border contrast-more:nx-border-current"
        )}
        spellCheck={false}
        {...props}
      />
      {suffix}
    </div>
  )
);
