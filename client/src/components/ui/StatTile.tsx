import type { ReactNode } from "react";

interface StatTileProps {
    icon: ReactNode;
    label: string;
    value: string;
    hint?: string;
}

export function StatTile({ icon, label, value, hint }: StatTileProps) {
    return (
        <div className="rounded-2xl p-5 bg-[var(--color-card)] border border-[var(--color-border)]">
            <div className="flex items-center gap-2 text-[var(--color-muted)] mb-2">
                {icon}
                <span className="text-sm font-medium">{label}</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-foreground)]">{value}</p>
            {hint && <p className="text-xs text-[var(--color-muted)] mt-1">{hint}</p>}
        </div>
    );
}
