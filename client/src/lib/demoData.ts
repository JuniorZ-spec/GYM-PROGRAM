import type { SessionLog, TrainingPlan, UserProfile, WeightLog } from "../types";

const DAY_MS = 24 * 60 * 60 * 1000;
const daysAgo = (n: number) => new Date(Date.now() - n * DAY_MS).toISOString();

export const demoProfile: UserProfile = {
    userId: "demo",
    goal: "gain_muscle",
    currentWeight: 74,
    targetWeight: 78,
    height: 178,
    age: 26,
    gender: "male",
    level: "intermediate",
    daysPerWeek: 3,
    location: "gym",
    equipment: ["dumbbells", "barbell", "bench"],
    injuries: null,
    updatedAt: daysAgo(0),
};

export const demoPlan: TrainingPlan = {
    id: "demo-plan",
    userId: "demo",
    version: 1,
    createdAt: daysAgo(14),
    overview: {
        goal: "gain_muscle",
        level: "intermediate",
        weeks: 8,
        summary: "Programme 3 jours par semaine axé sur la prise de masse : pecs/épaules, jambes, dos/biceps.",
    },
    weeklySchedule: [
        {
            day: "Lundi",
            focus: "Pecs, épaules, triceps",
            exercises: [
                { name: "Développé couché", sets: 4, reps: "8-10", rest: "90s" },
                { name: "Développé militaire", sets: 3, reps: "8-10", rest: "90s" },
                { name: "Écartés inclinés", sets: 3, reps: "12", rest: "60s" },
                { name: "Extensions triceps", sets: 3, reps: "12", rest: "60s" },
            ],
        },
        {
            day: "Mercredi",
            focus: "Jambes",
            exercises: [
                { name: "Squat", sets: 4, reps: "8", rest: "120s" },
                { name: "Presse à cuisses", sets: 3, reps: "10-12", rest: "90s" },
                { name: "Soulevé de terre roumain", sets: 3, reps: "10", rest: "90s" },
                { name: "Mollets debout", sets: 4, reps: "15", rest: "45s" },
            ],
        },
        {
            day: "Vendredi",
            focus: "Dos, biceps",
            exercises: [
                { name: "Tractions", sets: 4, reps: "6-8", rest: "90s" },
                { name: "Rowing barre", sets: 4, reps: "8-10", rest: "90s" },
                { name: "Tirage horizontal", sets: 3, reps: "12", rest: "60s" },
                { name: "Curl biceps", sets: 3, reps: "12", rest: "60s" },
            ],
        },
    ],
    progression: [
        { week: 1, focus: "Prise en main", notes: "Apprends les mouvements avec des charges modérées." },
        { week: 2, focus: "Montée en charge", notes: "Ajoute 2,5 kg sur les exercices de base si les séries sont maîtrisées." },
        { week: 3, focus: "Volume", notes: "Ajoute une série sur les exercices principaux." },
        { week: 4, focus: "Décharge", notes: "Réduis les charges de 10 % pour récupérer." },
        { week: 5, focus: "Intensité", notes: "Charges lourdes, répétitions plus basses." },
        { week: 6, focus: "Volume", notes: "Maintiens les charges et vise plus de répétitions." },
        { week: 7, focus: "Pic de forme", notes: "Bats tes records personnels." },
        { week: 8, focus: "Décharge finale", notes: "Récupère avant de repartir sur un nouveau cycle." },
    ],
    advice: {
        nutrition: "Vise environ 1,8 g de protéines par kg de poids de corps et un léger surplus calorique (+250 kcal).",
        hydration: "Bois 2,5 à 3 litres d'eau par jour, plus si la séance est intense.",
        recovery: "Dors 7 à 9 heures par nuit et garde au moins un jour de repos entre deux séances.",
        form: "Contrôle la phase descendante, garde le dos neutre et privilégie la technique à la charge.",
    },
};

export const demoWeightHistory: WeightLog[] = [72, 72.4, 72.9, 73.2, 73.6, 74].map((weight, i) => ({
    id: `demo-w${i}`,
    userId: "demo",
    weight,
    loggedAt: daysAgo((5 - i) * 7),
}));

export const demoSessions: SessionLog[] = [
    { day: "Lundi", ago: 4 },
    { day: "Mercredi", ago: 2 },
    { day: "Vendredi", ago: 1 },
].map((s, i) => ({
    id: `demo-s${i}`,
    userId: "demo",
    week: 1,
    day: s.day,
    completedAt: daysAgo(s.ago),
}));
