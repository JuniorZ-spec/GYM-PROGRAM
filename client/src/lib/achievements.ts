import {
    Award,
    Dumbbell,
    Flame,
    Footprints,
    LineChart,
    Scale,
    Target,
    Trophy,
    type LucideIcon,
} from "lucide-react";
import type { SessionLog, TrainingPlan, UserProfile, WeightLog } from "../types";

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(iso: string) {
    const d = new Date(iso);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export interface Streak {
    current: number;
    longest: number;
}

export function computeStreak(sessions: SessionLog[]): Streak {
    if (sessions.length === 0) return { current: 0, longest: 0 };

    const days = Array.from(new Set(sessions.map((s) => startOfDay(s.completedAt)))).sort((a, b) => a - b);

    let longest = 1;
    let run = 1;
    for (let i = 1; i < days.length; i++) {
        run = days[i] - days[i - 1] === DAY_MS ? run + 1 : 1;
        longest = Math.max(longest, run);
    }

    const daySet = new Set(days);
    const todayStart = startOfDay(new Date().toISOString());
    let cursor = daySet.has(todayStart) ? todayStart : todayStart - DAY_MS;
    let current = 0;
    while (daySet.has(cursor)) {
        current += 1;
        cursor -= DAY_MS;
    }

    return { current, longest };
}

export interface Badge {
    id: string;
    label: string;
    description: string;
    icon: LucideIcon;
    unlocked: boolean;
}

interface ComputeBadgesParams {
    sessions: SessionLog[];
    weightHistory: WeightLog[];
    profile: UserProfile;
    plan: TrainingPlan;
    streak: Streak;
}

export function computeBadges({ sessions, weightHistory, profile, plan, streak }: ComputeBadgesParams): Badge[] {
    const totalPossibleSessions = plan.weeklySchedule.length * plan.overview.weeks;
    const latestWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : profile.currentWeight;

    return [
        {
            id: "first-session",
            label: "Premier pas",
            description: "Complète ta première séance",
            icon: Footprints,
            unlocked: sessions.length >= 1,
        },
        {
            id: "sessions-5",
            label: "Régulier",
            description: "5 séances complétées",
            icon: Dumbbell,
            unlocked: sessions.length >= 5,
        },
        {
            id: "sessions-20",
            label: "Habitué",
            description: "20 séances complétées",
            icon: Trophy,
            unlocked: sessions.length >= 20,
        },
        {
            id: "streak-3",
            label: "Série de 3",
            description: "3 jours d'entraînement à la suite",
            icon: Flame,
            unlocked: streak.longest >= 3,
        },
        {
            id: "streak-7",
            label: "Série de 7",
            description: "7 jours d'entraînement à la suite",
            icon: Flame,
            unlocked: streak.longest >= 7,
        },
        {
            id: "first-weight",
            label: "Première pesée",
            description: "Enregistre ton premier poids",
            icon: Scale,
            unlocked: weightHistory.length >= 1,
        },
        {
            id: "weight-5",
            label: "Suivi assidu",
            description: "5 pesées enregistrées",
            icon: LineChart,
            unlocked: weightHistory.length >= 5,
        },
        {
            id: "halfway",
            label: "Mi-parcours",
            description: "La moitié du programme complétée",
            icon: Target,
            unlocked: totalPossibleSessions > 0 && sessions.length >= totalPossibleSessions / 2,
        },
        {
            id: "goal-reached",
            label: "Objectif atteint",
            description: "Ton poids actuel correspond à ton objectif",
            icon: Award,
            unlocked: latestWeight === profile.targetWeight,
        },
    ];
}
