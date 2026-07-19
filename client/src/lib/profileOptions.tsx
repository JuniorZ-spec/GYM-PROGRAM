import {
    Building2,
    Dumbbell,
    Flame,
    HeartPulse,
    Home as HomeIcon,
    Sparkles,
    Wind,
} from "lucide-react";

export const goalOptions = [
    { value: "lose_weight", label: "Perte de poids", description: "Brûler les graisses et affiner la silhouette", icon: <Flame className="w-5 h-5" /> },
    { value: "gain_muscle", label: "Prise de masse", description: "Développer la masse musculaire", icon: <Dumbbell className="w-5 h-5" /> },
    { value: "endurance", label: "Endurance", description: "Améliorer le souffle et la résistance", icon: <Wind className="w-5 h-5" /> },
    { value: "toning", label: "Tonification", description: "Raffermir et dessiner le corps", icon: <Sparkles className="w-5 h-5" /> },
    { value: "general_fitness", label: "Remise en forme", description: "Retrouver la forme générale", icon: <HeartPulse className="w-5 h-5" /> },
];

export const goalLabels: Record<string, string> = Object.fromEntries(
    goalOptions.map((o) => [o.value, o.label])
);

export const genderOptions = [
    { value: "female", label: "Femme" },
    { value: "male", label: "Homme" },
    { value: "other", label: "Autre" },
];

export const levelOptions = [
    { value: "beginner", label: "Débutant", description: "Peu ou pas d'expérience" },
    { value: "intermediate", label: "Intermédiaire", description: "6 mois à 2 ans d'entraînement" },
    { value: "advanced", label: "Avancé", description: "Plus de 2 ans d'entraînement régulier" },
];

export const daysOptions = [
    { value: "2", label: "2 jours" },
    { value: "3", label: "3 jours" },
    { value: "4", label: "4 jours" },
    { value: "5", label: "5 jours" },
    { value: "6", label: "6 jours" },
];

export const locationOptions = [
    { value: "home", label: "Maison", description: "S'entraîner chez soi", icon: <HomeIcon className="w-5 h-5" /> },
    { value: "gym", label: "Salle de sport", description: "Accès à une salle équipée", icon: <Building2 className="w-5 h-5" /> },
];

export const equipmentOptions = [
    { value: "none", label: "Aucun matériel" },
    { value: "dumbbells", label: "Haltères" },
    { value: "barbell", label: "Barre & poids" },
    { value: "bench", label: "Banc" },
    { value: "resistance_bands", label: "Élastiques" },
    { value: "pull_up_bar", label: "Barre de traction" },
    { value: "machines", label: "Machines de musculation" },
];
