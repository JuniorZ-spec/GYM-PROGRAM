import type { Badge } from "../../lib/achievements";

interface AchievementsProps {
    badges: Badge[];
}

export function Achievements({ badges }: AchievementsProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {badges.map((badge) => {
                const Icon = badge.icon;
                return (
                    <div
                        key={badge.id}
                        className={`rounded-2xl p-4 border text-center ${
                            badge.unlocked
                                ? "bg-[var(--color-card)] border-[var(--color-accent)]"
                                : "bg-[var(--color-card)] border-[var(--color-border)] opacity-40"
                        }`}
                    >
                        <Icon className={`w-6 h-6 mx-auto mb-2 ${badge.unlocked ? "text-[var(--color-accent)]" : "text-[var(--color-muted)]"}`} />
                        <p className="text-sm font-semibold">{badge.label}</p>
                        <p className="text-xs text-[var(--color-muted)] mt-1">{badge.description}</p>
                    </div>
                );
            })}
        </div>
    );
}
