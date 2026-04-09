import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-primary/20 placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full rounded-xl border bg-background px-4 py-3 text-base font-mono shadow-sm transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus:border-primary focus:ring-4 focus:ring-primary/5",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
