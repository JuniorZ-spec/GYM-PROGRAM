import type { ReactNode } from "react";

export interface SelectableOption {
    value: string;
    label: string;
    description?: string;
    icon?: ReactNode;
}

interface SelectableCardGroupProps {
    options: SelectableOption[];
    value: string;
    onChange: (value: string) => void;
    columns?: 1 | 2 | 3;
}

export function SelectableCardGroup({ options, value, onChange, columns = 2 }: SelectableCardGroupProps) {
    const gridCols = columns === 1 ? "grid-cols-1" : columns === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2";

    return (
        <div className={`grid ${gridCols} gap-3`}>
            {options.map((option) => {
                const active = option.value === value;
                return (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onChange(option.value)}
                        className={`flex items-start gap-3 text-left rounded-xl border p-4 transition-colors cursor-pointer ${
                            active
                                ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
                                : "border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-muted)]"
                        }`}
                    >
                        {option.icon && (
                            <span className={active ? "text-[var(--color-accent)]" : "text-[var(--color-muted)]"}>
                                {option.icon}
                            </span>
                        )}
                        <span className="flex flex-col">
                            <span className="font-medium text-[var(--color-foreground)]">{option.label}</span>
                            {option.description && (
                                <span className="text-sm text-[var(--color-muted)]">{option.description}</span>
                            )}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
