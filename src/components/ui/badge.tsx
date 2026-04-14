import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-rose-100 text-rose-800 hover:bg-rose-200",
        secondary:
          "border-transparent bg-amber-100 text-amber-800 hover:bg-amber-200",
        accent:
          "border-transparent bg-gradient-to-r from-rose-100 to-amber-100 text-rose-800",
        outline: "text-foreground border-rose-200",
        difficulty: {
          beginner: "border-transparent bg-green-100 text-green-800",
          intermediate: "border-transparent bg-amber-100 text-amber-800",
          advanced: "border-transparent bg-purple-100 text-purple-800",
        }
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
