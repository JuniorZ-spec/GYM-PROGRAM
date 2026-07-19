import { useEffect, useState } from "react";
import { RedirectToSignIn, SignedIn } from "@neondatabase/neon-js/auth/react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { api } from "../lib/api";
import type { UserProfile } from "../types";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { SelectableCardGroup } from "../components/ui/SelectableCard";
import { CheckboxCardGroup } from "../components/ui/CheckboxCardGroup";
import {
    goalOptions,
    genderOptions,
    levelOptions,
    daysOptions,
    locationOptions,
    equipmentOptions,
} from "../lib/profileOptions";
import { Loader2, Moon, Sparkles, Sun } from "lucide-react";

export default function Settings() {
    const { user, saveProfile } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [regenerating, setRegenerating] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

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

    useEffect(() => {
        if (!user) return;
        api.getProfile(user.id)
            .then((profile: UserProfile) => {
                setFormData({
                    goal: profile.goal,
                    currentWeight: String(profile.currentWeight),
                    targetWeight: String(profile.targetWeight),
                    height: String(profile.height),
                    age: String(profile.age),
                    gender: profile.gender,
                    level: profile.level,
                    daysPerWeek: String(profile.daysPerWeek),
                    location: profile.location,
                    equipment: profile.equipment,
                    injuries: profile.injuries || "",
                });
            })
            .finally(() => setLoading(false));
    }, [user]);

    function updateFormData<K extends keyof typeof formData>(field: K, value: typeof formData[K]) {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSave() {
        setSaving(true);
        setMessage('');
        setError('');
        try {
            await saveProfile({
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
            });
            setMessage('Profil mis à jour avec succès.');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Impossible de sauvegarder le profil');
        } finally {
            setSaving(false);
        }
    }

    async function handleRegenerate() {
        if (!user) return;
        setRegenerating(true);
        setMessage('');
        setError('');
        try {
            await api.generatePlan(user.id);
            setMessage('Un nouveau programme a été généré. Retrouve-le sur ton tableau de bord.');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Impossible de régénérer le programme');
        } finally {
            setRegenerating(false);
        }
    }

    if (!user) {
        return <RedirectToSignIn />
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[var(--color-accent)] animate-spin" />
            </div>
        );
    }

    return (
        <SignedIn>
            <div className="min-h-screen pt-24 pb-16 px-6">
                <div className="max-w-2xl mx-auto space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">Paramètres</h1>
                        <p className="text-[var(--color-muted)]">Modifie ton objectif, ton poids ou l'apparence de l'application.</p>
                    </div>

                    <Card variant="bordered">
                        <h2 className="font-semibold text-lg mb-4">Apparence</h2>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Thème</p>
                                <p className="text-sm text-[var(--color-muted)]">Choisis entre le thème sombre ou clair.</p>
                            </div>
                            <Button variant="secondary" onClick={toggleTheme} className="gap-2">
                                {theme === "dark" ? <><Sun className="w-4 h-4" /> Passer au clair</> : <><Moon className="w-4 h-4" /> Passer au sombre</>}
                            </Button>
                        </div>
                    </Card>

                    <Card variant="bordered" className="space-y-5">
                        <h2 className="font-semibold text-lg">Mon profil</h2>

                        <div>
                            <p className="text-sm font-medium mb-2">Objectif</p>
                            <SelectableCardGroup
                                options={goalOptions}
                                value={formData.goal}
                                onChange={(v) => updateFormData("goal", v)}
                                columns={1}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input id="currentWeight" type="number" label="Poids actuel" suffix="kg" value={formData.currentWeight} onChange={(e) => updateFormData("currentWeight", e.target.value)} />
                            <Input id="targetWeight" type="number" label="Poids cible" suffix="kg" value={formData.targetWeight} onChange={(e) => updateFormData("targetWeight", e.target.value)} />
                            <Input id="height" type="number" label="Taille" suffix="cm" value={formData.height} onChange={(e) => updateFormData("height", e.target.value)} />
                            <Input id="age" type="number" label="Âge" suffix="ans" value={formData.age} onChange={(e) => updateFormData("age", e.target.value)} />
                        </div>

                        <div>
                            <p className="text-sm font-medium mb-2">Sexe</p>
                            <SelectableCardGroup options={genderOptions} value={formData.gender} onChange={(v) => updateFormData("gender", v)} columns={3} />
                        </div>

                        <div>
                            <p className="text-sm font-medium mb-2">Niveau</p>
                            <SelectableCardGroup options={levelOptions} value={formData.level} onChange={(v) => updateFormData("level", v)} columns={1} />
                        </div>

                        <div>
                            <p className="text-sm font-medium mb-2">Jours par semaine</p>
                            <SelectableCardGroup options={daysOptions} value={formData.daysPerWeek} onChange={(v) => updateFormData("daysPerWeek", v)} columns={3} />
                        </div>

                        <div>
                            <p className="text-sm font-medium mb-2">Lieu d'entraînement</p>
                            <SelectableCardGroup options={locationOptions} value={formData.location} onChange={(v) => updateFormData("location", v)} columns={2} />
                        </div>

                        <div>
                            <p className="text-sm font-medium mb-2">Matériel disponible</p>
                            <CheckboxCardGroup options={equipmentOptions} values={formData.equipment} onChange={(v) => updateFormData("equipment", v)} columns={2} />
                        </div>

                        <Textarea
                            id="injuries"
                            label="Blessures ou limitations (optionnel)"
                            rows={3}
                            value={formData.injuries}
                            onChange={(e) => updateFormData("injuries", e.target.value)}
                        />

                        {message && <p className="text-sm text-[var(--color-accent)]">{message}</p>}
                        {error && <p className="text-sm text-red-500">{error}</p>}

                        <div className="flex flex-wrap gap-3 pt-2">
                            <Button onClick={handleSave} disabled={saving} className="gap-2">
                                {saving && <Loader2 className="w-4 h-4 animate-spin" />} Enregistrer les modifications
                            </Button>
                            <Button variant="secondary" onClick={handleRegenerate} disabled={regenerating} className="gap-2">
                                {regenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                Régénérer mon programme
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </SignedIn>
    );
}
