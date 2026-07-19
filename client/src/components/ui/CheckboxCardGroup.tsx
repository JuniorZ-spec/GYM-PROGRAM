import { Check } from "lucide-react";
import type { SelectableOption } from "./SelectableCard";

interface CheckboxCardGroupProps {
    options: SelectableOption[];
    values: string[];
    onChange: (values: string[]) => void;
    columns?: 1 | 2 | 3;
}

export function CheckboxCardGroup({ options, values, onChange, columns = 2 }: CheckboxCardGroupProps) {
    const gridCols = columns === 1 ? "grid-cols-1" : columns === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2";

    function toggle(value: string) {
        if (values.includes(value)) {
            onChange(values.filter((v) => v !== value));
        } else {
            onChange([...values, value]);
        }
    }

    return (
        <div className={`grid ${gridCols} gap-3`}>
            {options.map((option) => {
                const active = values.includes(option.value);
                return (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => toggle(option.value)}
                        className={`flex items-center justify-between gap-3 text-left rounded-xl border p-4 transition-colors cursor-pointer ${
                            active
                                ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
                                : "border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-muted)]"
                        }`}
                    >
                        <span className="font-medium text-[var(--color-foreground)]">{option.label}</span>
                        <span
                            className={`flex items-center justify-center w-5 h-5 rounded-md border ${
                                active
                                    ? "bg-[var(--color-accent)] border-[var(--color-accent)]"
                                    : "border-[var(--color-border)]"
                            }`}
                        >
                            {active && <Check className="w-3.5 h-3.5 text-[var(--color-accent-foreground)]" />}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
