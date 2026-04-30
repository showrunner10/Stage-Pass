import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 button-premium-motion",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-strong",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-border bg-transparent text-offwhite hover:border-primary/70 hover:text-white hover:shadow-[0_14px_26px_-16px_rgba(83,74,183,0.8)]",
        secondary:
          "bg-surface-elevated text-offwhite hover:bg-surface-elevated/80",
        ghost: "bg-transparent text-offwhite/80 hover:bg-white/5 hover:text-white",
        link: "text-primary underline-offset-4 hover:underline",
        premium: "bg-primary text-white shadow-[0_10px_26px_-12px_rgba(83,74,183,0.95)] hover:bg-primary-strong",
        outline_premium: "border border-primary/55 text-primary hover:bg-primary/20 hover:text-white hover:border-primary",
        dark: "bg-surface text-white hover:bg-surface-elevated border border-border",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-9 px-3.5 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
