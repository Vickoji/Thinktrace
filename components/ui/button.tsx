import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva("tt-button", {
  variants: {
    variant: {
      default: "tt-button-solid",
      outline: "tt-button-outline",
      light: "tt-button-light",
    },
    size: { default: "tt-button-default", small: "tt-button-small" },
  },
  defaultVariants: { variant: "default", size: "default" },
});

export function Button({
  className, variant, size, ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return <button data-slot="button" className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
