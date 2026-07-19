import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../lib/api";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import {
    ArrowRight,
    ClipboardList,
    Dumbbell,
    Flame,
    LineChart,
    Loader2,
    Sparkles,
    Target,
} from "lucide-react";

const features = [
    {
        icon: <Target className="w-6 h-6" />,
        title: "Programme sur mesure",
        description: "Un plan d'entraînement généré selon ton objectif, ton niveau et ton matériel.",
    },
    {
        icon: <LineChart className="w-6 h-6" />,
        title: "Progression intelligente",
        description: "Un plan d'évolution semaine après semaine pour progresser sans stagner.",
    },
    {
        icon: <Sparkles className="w-6 h-6" />,
        title: "Conseils intégrés",
        description: "Nutrition, hydratation, récupération et forme d'exécution, personnalisés pour toi.",
    },
    {
        icon: <ClipboardList className="w-6 h-6" />,
        title: "Suivi de tes résultats",
        description: "Poids, séances complétées et évolution, réunis dans un tableau de bord clair.",
    },
];

const steps = [
    { title: "Dis-nous qui tu es", description: "Objectif, poids, niveau, matériel disponible : quelques questions rapides." },
    { title: "Reçois ton programme", description: "Notre IA génère un plan d'entraînement complet et personnalisé." },
    { title: "Progresse chaque semaine", description: "Suis tes séances, ton poids et ton évolution en un coup d'œil." },
];

export default function Home() {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();
    const [checking, setChecking] = useState(false);

    useEffect(() => {
        if (!user) return;

        setChecking(true);
        api.getProfile(user.id)
            .then(() => navigate('/dashboard', { replace: true }))
            .catch(() => navigate('/onboarding', { replace: true }));
    }, [user, navigate]);

    if (isLoading || (user && checking)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[var(--color-accent)] animate-spin" />
            </div>
        );
    }

    if (user) {
        return null;
    }

    return (
        <div>
            <section className="pt-32 pb-20 px-6 text-center">
                <div className="max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-card)] border border-[var(--color-border)] text-sm text-[var(--color-muted)] mb-6">
                        <Flame className="w-4 h-4 text-[var(--color-accent)]" />
                        Ton programme, généré par IA, en 2 minutes
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-bold leading-tight mb-6">
                        Atteins tes objectifs avec <span className="text-[var(--color-accent)]">YM</span>
                    </h1>
                    <p className="text-lg text-[var(--color-muted)] max-w-xl mx-auto mb-10">
                        YM crée ton programme d'entraînement personnalisé selon ton objectif, ton poids et ton niveau,
                        avec des conseils intégrés pour progresser sans te blesser.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link to="/auth/sign-up">
                            <Button size="lg" className="gap-2">
                                Commencer <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                        <Link to="/auth/sign-in">
                            <Button size="lg" variant="secondary">
                                Se connecter
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="px-6 pb-20">
                <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {features.map((feature) => (
                        <Card key={feature.title} variant="bordered">
                            <div className="text-[var(--color-accent)] mb-3">{feature.icon}</div>
                            <h3 className="font-semibold mb-1">{feature.title}</h3>
                            <p className="text-sm text-[var(--color-muted)]">{feature.description}</p>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="px-6 pb-24">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">Comment ça marche</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <div key={step.title} className="text-center">
                                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--color-accent)] text-[var(--color-accent-foreground)] flex items-center justify-center font-bold text-lg">
                                    {index + 1}
                                </div>
                                <h3 className="font-semibold mb-2">{step.title}</h3>
                                <p className="text-sm text-[var(--color-muted)]">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-6 pb-24">
                <Card variant="bordered" className="max-w-3xl mx-auto text-center py-10">
                    <Dumbbell className="w-10 h-10 text-[var(--color-accent)] mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Prêt à passer à l'action ?</h2>
                    <p className="text-[var(--color-muted)] mb-6">Ton programme personnalisé t'attend, il ne manque que toi.</p>
                    <Link to="/auth/sign-up">
                        <Button size="lg" className="gap-2">
                            Commencer maintenant <ArrowRight className="w-5 h-5" />
                        </Button>
                    </Link>
                </Card>
            </section>
        </div>
    )
}
