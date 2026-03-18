import { type SelectHTMLAttributes } from "react";

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    id: string;
    label: string;
    options: SelectOption[];
}

export function Select({ id, label, options, className = "", ...props }: SelectProps) {
    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={id} className="text-sm font-medium text-[var(--color-foreground)]">
                {label}
            </label>
            <select
                id={id}
                name={id}
                className={`w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] ${className}`}
                {...props}
            >
                <option value="">Select an option</option>
                {options.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>
        </div>
    );
}
