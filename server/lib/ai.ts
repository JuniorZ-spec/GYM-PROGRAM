import OpenAI from 'openai';
import 'dotenv/config';
import { UserProfile, TrainingPlan } from '../types';

const goalLabels: Record<string, string> = {
    lose_weight: 'perte de poids',
    gain_muscle: 'prise de masse musculaire',
    endurance: "amélioration de l'endurance",
    toning: 'tonification musculaire',
    general_fitness: 'remise en forme générale',
};

const levelLabels: Record<string, string> = {
    beginner: 'débutant',
    intermediate: 'intermédiaire',
    advanced: 'avancé',
};

const locationLabels: Record<string, string> = {
    home: 'à la maison',
    gym: 'en salle de sport',
};

const genderLabels: Record<string, string> = {
    male: 'homme',
    female: 'femme',
    other: 'autre',
};

function normalizeProfile(profile: UserProfile | Record<string, any>): UserProfile {
    return {
        userId: profile.userId || '',
        updatedAt: profile.updatedAt || new Date(),
        goal: profile.goal || 'general_fitness',
        currentWeight: Number(profile.currentWeight) || 70,
        targetWeight: Number(profile.targetWeight) || Number(profile.currentWeight) || 70,
        height: Number(profile.height) || 170,
        age: Number(profile.age) || 30,
        gender: profile.gender || 'other',
        level: profile.level || 'beginner',
        daysPerWeek: Number(profile.daysPerWeek) || 3,
        location: profile.location || 'home',
        equipment: Array.isArray(profile.equipment) ? profile.equipment : [],
        injuries: profile.injuries || '',
    };
}

function buildPrompt(profile: UserProfile): string {
    const equipmentText = profile.equipment.length > 0
        ? profile.equipment.join(', ')
        : 'aucun matériel';

    return `Crée un programme d'entraînement personnalisé pour cet utilisateur :
- Objectif : ${goalLabels[profile.goal] || profile.goal}
- Niveau : ${levelLabels[profile.level] || profile.level}
- Sexe : ${genderLabels[profile.gender] || profile.gender}
- Âge : ${profile.age} ans
- Poids actuel : ${profile.currentWeight} kg
- Poids cible : ${profile.targetWeight} kg
- Taille : ${profile.height} cm
- Jours d'entraînement disponibles par semaine : ${profile.daysPerWeek}
- Lieu d'entraînement : ${locationLabels[profile.location] || profile.location}
- Matériel disponible : ${equipmentText}
- Blessures ou limitations : ${profile.injuries || 'aucune'}

Réponds UNIQUEMENT avec un objet JSON valide (aucun texte hors du JSON), en français, respectant exactement cette forme :
{
  "overview": { "goal": string, "level": string, "weeks": number, "summary": string },
  "weeklySchedule": [
    { "day": string, "focus": string, "exercises": [ { "name": string, "sets": number, "reps": string, "rest": string, "notes": string } ] }
  ],
  "progression": [
    { "week": number, "focus": string, "notes": string }
  ],
  "advice": { "nutrition": string, "hydration": string, "recovery": string, "form": string }
}

Contraintes :
- "weeklySchedule" doit contenir exactement ${profile.daysPerWeek} jour(s) d'entraînement (n'inclus pas les jours de repos).
- Limite chaque jour à 5 exercices maximum.
- Adapte les exercices au matériel disponible et aux éventuelles blessures.
- "overview.weeks" doit être compris entre 4 et 6.
- "progression" doit avoir exactement autant d'entrées que "overview.weeks", avec une évolution claire de la charge/volume.
- Sois concis : chaque champ "notes" fait une seule courte phrase, chaque champ de "advice" fait 1 à 2 courtes phrases.
- Les conseils dans "advice" doivent être concrets et personnalisés au profil (nutrition de base, hydratation, récupération, forme d'exécution).`;
}

function isValidPlanShape(data: any): boolean {
    return (
        data &&
        typeof data.overview === 'object' &&
        Array.isArray(data.weeklySchedule) &&
        Array.isArray(data.progression) &&
        typeof data.advice === 'object'
    );
}

export async function generateTrainingPlan(
    profile: UserProfile | Record<string, any>,
): Promise<Omit<TrainingPlan, 'id' | 'userId' | 'version' | 'createdAt'>> {
    const normalizedProfile = normalizeProfile(profile);

    const apiKey = process.env.OPEN_ROUTER_API_KEY;
    if (!apiKey) {
        throw new Error('OPEN_ROUTER_API_KEY is not set');
    }

    const openai = new OpenAI({
        apiKey,
        baseURL: 'https://openrouter.ai/api/v1',
        defaultHeaders: {
            'HTTP-Referer': process.env.BASE_URL || 'http://localhost:3001',
            'X-Title': 'YM',
        },
    });

    const prompt = buildPrompt(normalizedProfile);

    const maxRetries = 3;
    let completion;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            completion = await openai.chat.completions.create({
                model: 'openai/gpt-oss-20b:free',
                messages: [
                    {
                        role: 'system',
                        content: 'Tu es un coach sportif expert. Tu réponds uniquement en JSON valide, sans markdown ni texte hors du JSON.',
                    },
                    { role: 'user', content: prompt },
                ],
                temperature: 0.7,
                max_tokens: 6000,
                response_format: { type: 'json_object' },
            });
            break;
        } catch (err: any) {
            const isRateLimited = err?.status === 429;
            if (!isRateLimited || attempt === maxRetries) throw err;
            const retryAfter = Number(err?.headers?.['retry-after']) || 5;
            await new Promise((resolve) => setTimeout(resolve, Math.min(retryAfter, 20) * 1000));
        }
    }

    const content = completion?.choices[0]?.message?.content;
    if (!content) throw new Error("Aucune réponse de l'IA");

    let parsed: any;
    try {
        parsed = JSON.parse(content);
    } catch {
        console.error("Réponse IA non-JSON, contenu brut:", content.slice(0, 1000));
        throw new Error("Réponse de l'IA invalide (JSON malformé)");
    }

    if (!isValidPlanShape(parsed)) {
        throw new Error("Réponse de l'IA invalide (structure inattendue)");
    }

    return parsed;
}
