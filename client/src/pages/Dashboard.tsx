import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { api } from "../lib/api";
import type { SessionLog, TrainingPlan, UserProfile, WeightLog } from "../types";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { StatTile } from "../components/ui/StatTile";
import { WeightChart } from "../components/dashboard/WeightChart";
import { goalLabels } from "../lib/profileOptions";
import {
    Apple,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Circle,
    Droplet,
    Flame,
    Loader2,
    Moon,
    Scale,
    Sparkles,
    Target,
    TrendingUp,
} from "lucide-react";

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [plan, setPlan] = useState<TrainingPlan | null>(null);
    const [weightHistory, setWeightHistory] = useState<WeightLog[]>([]);
    const [sessions, setSessions] = useState<SessionLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState('');

    const [activeDay, setActiveDay] = useState(0);
    const [currentWeek, setCurrentWeek] = useState(1);
    const [newWeight, setNewWeight] = useState('');
    const [loggingWeight, setLoggingWeight] = useState(false);

    useEffect(() => {
        if (!user) return;
        loadData();
    }, [user]);

    async function loadData() {
        if (!user) return;
        setLoading(true);
        try {
            const profileData = await api.getProfile(user.id);
            setProfile(profileData);

            const [weights, sessionLogs] = await Promise.all([
                api.getWeightHistory(user.id),
                api.getSessions(user.id),
            ]);
            setWeightHistory(weights);
            setSessions(sessionLogs);

            try {
                const planData = await api.getPlan(user.id);
                setPlan(planData);
            } catch {
                setPlan(null);
            }
        } catch {
            navigate('/onboarding', { replace: true });
        } finally {
            setLoading(false);
        }
    }

    async function handleGeneratePlan() {
        if (!user) return;
        setGenerating(true);
        setError('');
        try {
            const newPlan = await api.generatePlan(user.id);
            setPlan(newPlan);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Impossible de générer le programme');
        } finally {
            setGenerating(false);
        }
    }

    async function handleLogWeight() {
        if (!user || !newWeight) return;
        setLoggingWeight(true);
        try {
            const log = await api.logWeight(user.id, Number(newWeight));
            setWeightHistory((prev) => [...prev, log]);
            setNewWeight('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Impossible d\'enregistrer le poids');
        } finally {
            setLoggingWeight(false);
        }
    }

    async function handleToggleSession(day: string) {
        if (!user) return;
        const alreadyDone = isSessionDone(day);
        if (alreadyDone) return;

        try {
            const log = await api.completeSession(user.id, currentWeek, day);
            setSessions((prev) => [...prev, log]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Impossible de valider la séance');
        }
    }

    function isSessionDone(day: string) {
        return sessions.some((s) => s.week === currentWeek && s.day === day);
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[var(--color-accent)] animate-spin" />
            </div>
        );
    }

    if (!profile) return null;

    if (!plan) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-6 flex items-center justify-center">
                <Card variant="bordered" className="max-w-md w-full text-center py-10">
                    <Sparkles className="w-10 h-10 text-[var(--color-accent)] mx-auto mb-4" />
                    <h1 className="text-xl font-bold mb-2">Aucun programme pour l'instant</h1>
                    <p className="text-[var(--color-muted)] mb-6">Génère ton programme personnalisé pour commencer à t'entraîner.</p>
                    {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
                    <Button onClick={handleGeneratePlan} disabled={generating} className="gap-2">
                        {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        {generating ? 'Génération en cours...' : 'Générer mon programme'}
                    </Button>
                </Card>
            </div>
        );
    }

    const latestWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : profile.currentWeight;
    const weightDelta = latestWeight - profile.targetWeight;
    const completedThisWeek = sessions.filter((s) => s.week === currentWeek).length;
    const activeDaySchedule = plan.weeklySchedule[activeDay];
    const activeProgression = plan.progression.find((p) => p.week === currentWeek);

    return (
        <div className="min-h-screen pt-24 pb-16 px-6">
            <div className="max-w-5xl mx-auto space-y-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                        Ton tableau de bord
                    </h1>
                    <p className="text-[var(--color-muted)]">
                        Objectif : <span className="text-[var(--color-accent)] font-medium">{goalLabels[profile.goal] || profile.goal}</span>
                    </p>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatTile
                        icon={<Scale className="w-4 h-4" />}
                        label="Poids actuel"
                        value={`${latestWeight} kg`}
                        hint={weightDelta === 0 ? "Objectif atteint !" : `${weightDelta > 0 ? '-' : '+'}${Math.abs(weightDelta).toFixed(1)} kg pour l'objectif`}
                    />
                    <StatTile
                        icon={<Flame className="w-4 h-4" />}
                        label="Séances cette semaine"
                        value={`${completedThisWeek} / ${plan.weeklySchedule.length}`}
                        hint={`Semaine ${currentWeek} sur ${plan.overview.weeks}`}
                    />
                    <StatTile
                        icon={<TrendingUp className="w-4 h-4" />}
                        label="Séances totales"
                        value={`${sessions.length}`}
                        hint="Depuis le début du programme"
                    />
                </div>

                <Card variant="bordered">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-lg flex items-center gap-2">
                            <Scale className="w-5 h-5 text-[var(--color-accent)]" /> Suivi du poids
                        </h2>
                    </div>
                    <WeightChart data={weightHistory} />
                    <div className="flex gap-3 mt-4">
                        <Input
                            id="newWeight"
                            type="number"
                            placeholder="Nouveau poids"
                            suffix="kg"
                            value={newWeight}
                            onChange={(e) => setNewWeight(e.target.value)}
                            className="flex-1"
                        />
                        <Button onClick={handleLogWeight} disabled={!newWeight || loggingWeight}>
                            {loggingWeight ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enregistrer'}
                        </Button>
                    </div>
                </Card>

                <Card variant="bordered">
                    <div className="flex items-start justify-between mb-4 gap-4 flex-wrap">
                        <div>
                            <h2 className="font-semibold text-lg mb-1">Ta semaine type</h2>
                            <p className="text-sm text-[var(--color-muted)]">{plan.overview.summary}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setCurrentWeek((w) => Math.max(1, w - 1))}
                                className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--color-border)] hover:border-[var(--color-accent)] cursor-pointer disabled:opacity-40"
                                disabled={currentWeek <= 1}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-medium whitespace-nowrap">Semaine {currentWeek} / {plan.overview.weeks}</span>
                            <button
                                type="button"
                                onClick={() => setCurrentWeek((w) => Math.min(plan.overview.weeks, w + 1))}
                                className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--color-border)] hover:border-[var(--color-accent)] cursor-pointer disabled:opacity-40"
                                disabled={currentWeek >= plan.overview.weeks}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {activeProgression && (
                        <div className="rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] p-4 mb-5">
                            <p className="text-sm font-medium text-[var(--color-accent)] mb-1">{activeProgression.focus}</p>
                            <p className="text-sm text-[var(--color-muted)]">{activeProgression.notes}</p>
                        </div>
                    )}

                    <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
                        {plan.weeklySchedule.map((day, index) => (
                            <button
                                key={day.day}
                                type="button"
                                onClick={() => setActiveDay(index)}
                                className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 ${
                                    activeDay === index
                                        ? "bg-[var(--color-accent)] text-[var(--color-accent-foreground)]"
                                        : "bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-foreground)] hover:border-[var(--color-accent)]"
                                }`}
                            >
                                {isSessionDone(day.day) && <CheckCircle2 className="w-3.5 h-3.5" />}
                                {day.day}
                            </button>
                        ))}
                    </div>

                    {activeDaySchedule && (
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <p className="font-medium text-[var(--color-foreground)]">{activeDaySchedule.focus}</p>
                                <Button
                                    size="sm"
                                    variant={isSessionDone(activeDaySchedule.day) ? "secondary" : "primary"}
                                    onClick={() => handleToggleSession(activeDaySchedule.day)}
                                    disabled={isSessionDone(activeDaySchedule.day)}
                                    className="gap-1.5"
                                >
                                    {isSessionDone(activeDaySchedule.day) ? (
                                        <><CheckCircle2 className="w-4 h-4" /> Séance faite</>
                                    ) : (
                                        <><Circle className="w-4 h-4" /> Marquer comme fait</>
                                    )}
                                </Button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-[var(--color-muted)] border-b border-[var(--color-border)]">
                                            <th className="py-2 pr-4">Exercice</th>
                                            <th className="py-2 pr-4">Séries</th>
                                            <th className="py-2 pr-4">Répétitions</th>
                                            <th className="py-2 pr-4">Repos</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activeDaySchedule.exercises.map((exercise) => (
                                            <tr key={exercise.name} className="border-b border-[var(--color-border)] last:border-0">
                                                <td className="py-2.5 pr-4 font-medium">{exercise.name}</td>
                                                <td className="py-2.5 pr-4">{exercise.sets}</td>
                                                <td className="py-2.5 pr-4">{exercise.reps}</td>
                                                <td className="py-2.5 pr-4">{exercise.rest}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </Card>

                <div>
                    <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-[var(--color-accent)]" /> Conseils personnalisés
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card variant="bordered">
                            <div className="flex items-center gap-2 mb-2 text-[var(--color-accent)]">
                                <Apple className="w-4 h-4" /> <span className="font-medium text-[var(--color-foreground)]">Nutrition</span>
                            </div>
                            <p className="text-sm text-[var(--color-muted)]">{plan.advice.nutrition}</p>
                        </Card>
                        <Card variant="bordered">
                            <div className="flex items-center gap-2 mb-2 text-[var(--color-accent)]">
                                <Droplet className="w-4 h-4" /> <span className="font-medium text-[var(--color-foreground)]">Hydratation</span>
                            </div>
                            <p className="text-sm text-[var(--color-muted)]">{plan.advice.hydration}</p>
                        </Card>
                        <Card variant="bordered">
                            <div className="flex items-center gap-2 mb-2 text-[var(--color-accent)]">
                                <Moon className="w-4 h-4" /> <span className="font-medium text-[var(--color-foreground)]">Récupération</span>
                            </div>
                            <p className="text-sm text-[var(--color-muted)]">{plan.advice.recovery}</p>
                        </Card>
                        <Card variant="bordered">
                            <div className="flex items-center gap-2 mb-2 text-[var(--color-accent)]">
                                <Sparkles className="w-4 h-4" /> <span className="font-medium text-[var(--color-foreground)]">Forme d'exécution</span>
                            </div>
                            <p className="text-sm text-[var(--color-muted)]">{plan.advice.form}</p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
