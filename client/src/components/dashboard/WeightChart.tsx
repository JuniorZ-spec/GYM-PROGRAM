import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import type { WeightLog } from "../../types";

interface WeightChartProps {
    data: WeightLog[];
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { value: number }[] }) {
    if (!active || !payload || payload.length === 0) return null;
    return (
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm shadow-lg">
            <span className="font-semibold text-[var(--color-foreground)]">{payload[0].value} kg</span>
        </div>
    );
}

export function WeightChart({ data }: WeightChartProps) {
    if (data.length < 2) {
        return (
            <div className="h-48 flex items-center justify-center text-sm text-[var(--color-muted)] text-center px-4">
                Ajoute au moins deux pesées pour voir ton évolution apparaître ici.
            </div>
        );
    }

    const chartData = data.map((log) => ({ date: formatDate(log.loggedAt), weight: log.weight }));

    return (
        <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke="var(--color-muted)"
                        tick={{ fill: "var(--color-muted)", fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: "var(--color-border)" }}
                    />
                    <YAxis
                        stroke="var(--color-muted)"
                        tick={{ fill: "var(--color-muted)", fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        width={40}
                        domain={["auto", "auto"]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="var(--color-accent)"
                        strokeWidth={2}
                        strokeLinecap="round"
                        dot={{ r: 4, fill: "var(--color-accent)", strokeWidth: 0 }}
                        activeDot={{ r: 5 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
