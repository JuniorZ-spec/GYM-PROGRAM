import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        { className = "", variant = "primary", size = "md", children, ...props },
        ref,
    ) => {
        const baseStyles =
            "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

        const variants = {
            primary:
                "bg-[var(--color-accent)] text-[var(--color-accent-foreground)] font-semibold hover:bg-[var(--color-accent-hover)] hover:-translate-y-0.5 shadow-[0_6px_20px_-6px_color-mix(in_srgb,var(--color-accent)_60%,transparent)]",
            secondary:
                "bg-[var(--color-card)] text-[var(--color-foreground)] border border-[var(--color-border)] hover:bg-[var(--color-border)]",
            ghost:
                "text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-card)]",
        };

        const sizes = {
            sm: "px-3 py-1.5 text-sm",
            md: "px-5 py-2.5 text-base",
            lg: "px-8 py-3 text-lg",
        };

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
                {...props}
            >
                {children}
            </button>
        );
    },
);

Button.displayName = "Button";