import { type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "bordered";
}

export function Card({ className = "", variant = "default", children, ...props }: CardProps) {
    const variants = {
        default: "bg-[var(--color-card)]",
        bordered: "bg-[var(--color-card)] border border-[var(--color-border)]",
    };

    return (
        <div
            className={`rounded-2xl p-6 ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
