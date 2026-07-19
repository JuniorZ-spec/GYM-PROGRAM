import { RedirectToSignIn, SignedIn } from "@neondatabase/neon-js/auth/react";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/ui/Card"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Textarea } from "../components/ui/Textarea";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Stepper } from "../components/ui/Stepper";
import { SelectableCardGroup } from "../components/ui/SelectableCard";
import { CheckboxCardGroup } from "../components/ui/CheckboxCardGroup";
import { api } from "../lib/api";
import {
    goalOptions,
    genderOptions,
    levelOptions,
    daysOptions,
    locationOptions,
    equipmentOptions,
} from "../lib/profileOptions";
import {
    ArrowLeft,
    ArrowRight,
    Loader2,
} from "lucide-react";

const steps = ["Objectif", "Profil physique", "Niveau & disponibilité", "Lieu & matériel", "Récapitulatif"];

export default function Onboarding() {

    const { user, saveProfile } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        goal: "",
        currentWeight: "",
        targetWeight: "",
        height: "",
        age: "",
        gender: "",
        level: "",
        daysPerWeek: "",
        location: "",
        equipment: [] as string[],
        injuries: "",
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    function updateFormData<K extends keyof typeof formData>(field: K, value: typeof formData[K]) {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }

    function isStepValid(): boolean {
        switch (step) {
            case 1:
                return !!formData.goal;
            case 2:
                return !!(formData.currentWeight && formData.targetWeight && formData.height && formData.age && formData.gender);
            case 3:
                return !!(formData.level && formData.daysPerWeek);
            case 4:
                return !!formData.location && formData.equipment.length > 0;
            default:
                return true;
        }
    }

    function goNext() {
        setError('');
        setStep((s) => Math.min(s + 1, steps.length));
    }

    function goBack() {
        setError('');
        setStep((s) => Math.max(s - 1, 1));
    }

    async function handleSubmit() {
        if (!user) return;

        setError('');
        setIsGenerating(true);

        try {
            const profile = {
                goal: formData.goal,
                currentWeight: Number(formData.currentWeight),
                targetWeight: Number(formData.targetWeight),
                height: Number(formData.height),
                age: Number(formData.age),
                gender: formData.gender,
                level: formData.level,
                daysPerWeek: Number(formData.daysPerWeek),
                location: formData.location,
                equipment: formData.equipment,
                injuries: formData.injuries || null,
            };

            await saveProfile(profile);
            await api.generatePlan(user.id);
            navigate('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
            setIsGenerating(false);
        }
    }

    if (!user) {
        return <RedirectToSignIn />
    }

    return (
        <SignedIn>
            <div className="min-h-screen pt-24 pb-12 px-6 flex items-center justify-center">
                <div className="max-w-lg w-full">

                    {!isGenerating ? (
                        <Card variant="bordered">
                            <Stepper steps={steps} currentStep={step} />

                            <div className="space-y-5">
                                {step === 1 && (
                                    <div className="space-y-4">
                                        <div>
                                            <h1 className="text-xl font-bold mb-1">Quel est ton objectif principal ?</h1>
                                            <p className="text-sm text-[var(--color-muted)]">On adapte tout ton programme autour de cet objectif.</p>
                                        </div>
                                        <SelectableCardGroup
                                            options={goalOptions}
                                            value={formData.goal}
                                            onChange={(v) => updateFormData("goal", v)}
                                            columns={1}
                                        />
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-4">
                                        <div>
                                            <h1 className="text-xl font-bold mb-1">Parle-nous de toi</h1>
                                            <p className="text-sm text-[var(--color-muted)]">Ces infos nous aident à calibrer ton programme.</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                id="currentWeight"
                                                type="number"
                                                label="Poids actuel"
                                                suffix="kg"
                                                value={formData.currentWeight}
                                                onChange={(e) => updateFormData("currentWeight", e.target.value)}
                                            />
                                            <Input
                                                id="targetWeight"
                                                type="number"
                                                label="Poids cible"
                                                suffix="kg"
                                                value={formData.targetWeight}
                                                onChange={(e) => updateFormData("targetWeight", e.target.value)}
                                            />
                                            <Input
                                                id="height"
                                                type="number"
                                                label="Taille"
                                                suffix="cm"
                                                value={formData.height}
                                                onChange={(e) => updateFormData("height", e.target.value)}
                                            />
                                            <Input
                                                id="age"
                                                type="number"
                                                label="Âge"
                                                suffix="ans"
                                                value={formData.age}
                                                onChange={(e) => updateFormData("age", e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium mb-2">Sexe</p>
                                            <SelectableCardGroup
                                                options={genderOptions}
                                                value={formData.gender}
                                                onChange={(v) => updateFormData("gender", v)}
                                                columns={3}
                                            />
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-4">
                                        <div>
                                            <h1 className="text-xl font-bold mb-1">Ton niveau et ta disponibilité</h1>
                                            <p className="text-sm text-[var(--color-muted)]">Sois honnête, ça garantit un programme adapté.</p>
                                        </div>
                                        <SelectableCardGroup
                                            options={levelOptions}
                                            value={formData.level}
                                            onChange={(v) => updateFormData("level", v)}
                                            columns={1}
                                        />
                                        <div>
                                            <p className="text-sm font-medium mb-2">Jours d'entraînement par semaine</p>
                                            <SelectableCardGroup
                                                options={daysOptions}
                                                value={formData.daysPerWeek}
                                                onChange={(v) => updateFormData("daysPerWeek", v)}
                                                columns={3}
                                            />
                                        </div>
                                    </div>
                                )}

                                {step === 4 && (
                                    <div className="space-y-4">
                                        <div>
                                            <h1 className="text-xl font-bold mb-1">Où et avec quoi t'entraînes-tu ?</h1>
                                            <p className="text-sm text-[var(--color-muted)]">On sélectionne des exercices réalisables avec ton matériel.</p>
                                        </div>
                                        <SelectableCardGroup
                                            options={locationOptions}
                                            value={formData.location}
                                            onChange={(v) => updateFormData("location", v)}
                                            columns={2}
                                        />
                                        <div>
                                            <p className="text-sm font-medium mb-2">Matériel disponible</p>
                                            <CheckboxCardGroup
                                                options={equipmentOptions}
                                                values={formData.equipment}
                                                onChange={(v) => updateFormData("equipment", v)}
                                                columns={2}
                                            />
                                        </div>
                                    </div>
                                )}

                                {step === 5 && (
                                    <div className="space-y-4">
                                        <div>
                                            <h1 className="text-xl font-bold mb-1">Dernier détail avant de générer ton programme</h1>
                                            <p className="text-sm text-[var(--color-muted)]">Signale toute blessure ou limitation, sinon passe à la suite.</p>
                                        </div>
                                        <Textarea
                                            id="injuries"
                                            label="Blessures ou limitations (optionnel)"
                                            placeholder="ex : douleurs lombaires, épaule fragile..."
                                            rows={3}
                                            value={formData.injuries}
                                            onChange={(e) => updateFormData("injuries", e.target.value)}
                                        />
                                    </div>
                                )}

                                {error && <p className="text-sm text-red-500">{error}</p>}

                                <div className="flex gap-3 pt-2">
                                    {step > 1 && (
                                        <Button type="button" variant="secondary" onClick={goBack} className="gap-2">
                                            <ArrowLeft className="w-4 h-4" /> Retour
                                        </Button>
                                    )}
                                    {step < steps.length ? (
                                        <Button type="button" className="flex-1 gap-2" disabled={!isStepValid()} onClick={goNext}>
                                            Suivant <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    ) : (
                                        <Button type="button" className="flex-1 gap-2" onClick={handleSubmit}>
                                            Générer mon programme <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ) : (
                        <Card variant="bordered" className="text-center py-6">
                            <Loader2 className="w-12 h-12 text-[var(--color-accent)] mx-auto animate-spin mb-6" />
                            <h1 className="font-bold text-2xl mb-2">Création de ton programme</h1>
                            <p className="text-[var(--color-muted)]">Notre IA prépare un plan sur mesure, ça ne prend que quelques secondes.</p>
                        </Card>
                    )}
                </div>
            </div>
        </SignedIn>
    )
}
