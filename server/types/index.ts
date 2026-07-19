export type Goal = 'lose_weight' | 'gain_muscle' | 'endurance' | 'toning' | 'general_fitness';
export type Level = 'beginner' | 'intermediate' | 'advanced';
export type Location = 'home' | 'gym';
export type Gender = 'male' | 'female' | 'other';

export interface UserProfile {
    userId: string;
    goal: Goal | string;
    currentWeight: number;
    targetWeight: number;
    height: number;
    age: number;
    gender: Gender | string;
    level: Level | string;
    daysPerWeek: number;
    location: Location | string;
    equipment: string[];
    injuries?: string | null;
    updatedAt: Date;
}

export interface PlanOverview {
    goal: string;
    level: string;
    weeks: number;
    summary: string;
}

export interface Exercise {
    name: string;
    sets: number;
    reps: string;
    rest: string;
    notes?: string;
}

export interface DaySchedule {
    day: string;
    focus: string;
    exercises: Exercise[];
}

export interface ProgressionWeek {
    week: number;
    focus: string;
    notes: string;
}

export interface PlanAdvice {
    nutrition: string;
    hydration: string;
    recovery: string;
    form: string;
}

export interface TrainingPlan {
    id: string;
    userId: string;
    overview: PlanOverview;
    weeklySchedule: DaySchedule[];
    progression: ProgressionWeek[];
    advice: PlanAdvice;
    version: number;
    createdAt: Date;
}

export interface WeightLog {
    id: string;
    userId: string;
    weight: number;
    loggedAt: Date;
}

export interface SessionLog {
    id: string;
    userId: string;
    week: number;
    day: string;
    completedAt: Date;
}
