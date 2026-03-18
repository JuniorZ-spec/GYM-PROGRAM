import { RedirectToSignIn, SignedIn } from "@neondatabase/neon-js/auth/react";
import { useAuth } from "../context/AuthContext";
import { Select } from "../components/ui/Select"
import { Card } from "../components/ui/Card"
import { useState } from "react";
import { Textarea } from "../components/ui/Textarea";
import { Button } from "../components/ui/Button";
import { ArrowRight } from "lucide-react";



const goalOptions = [
    { value: "lose_weight", label: "Lose Weight" },
    { value: "build_muscle", label: "Build Muscle" },
    { value: "improve_endurance", label: "Improve Endurance" },
    { value: "general_fitness", label: "General Fitness" },
    { value: "other", label: "Other" },
];




const experienceOptions = [
    { value: "beginner", label: "Beginner (0-6 months)" },
    { value: "intermediate", label: "Intermediate (6-24 months)" },
    { value: "advanced", label: "Advanced (2+ years)" },
];



const daysOptions = [
    { value: "1-2", label: "1-2 days per week" },
    { value: "3-4", label: "3-4 days per week" },
    { value: "5-6", label: "5-6 days per week" },

];



const sessionsOptions = [
    { value: "30", label: "30 minutes" },
    { value: "60", label: "60 minutes" },
    { value: "90", label: "90 minutes" },
    { value: "120", label: "120 minutes" },
];


const equipmentOptions = [
    { value: "none", label: "No Equipment" },
    { value: "basic", label: "Basic Equipment (dumbbells, resistance bands)" },
    { value: "full", label: "Full Gym Access" },
];


const splitOptions = [
    { value: "full_body", label: "Full Body" },
    { value: "upper_lower", label: "Upper/Lower Split" },
    { value: "push_pull_legs", label: "Push/Pull/Legs" },
    { value: "bro_split", label: "Bro Split (body part focus)" },
];


export default function Onboarding() {

    const { user } = useAuth();

    const [formData, setFormData] = useState({
        goal: "",
        experience: "",
        daysPerWeek: "",
        sessionLength: "",
        equipment: "",
        splitPreference: "",
        injuries: "",
    });

    function updateFormData(field: string, value: string) {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }

    async function handleQuestionnaire(e: React.SubmitEvent) {

        e.preventDefault();
    }

    if (!user) {
        return <RedirectToSignIn />
    }


    return (

        <SignedIn>
            <div className="min-h-screen pt-24 pb-12 px-6 flex items-center justify-center">
                <div className="max-w-lg w-full">

                    {/* process indicator */}


                    { /* Step 1: Questionnaire*/}
                    <Card variant="bordered">
                        <h1> Tell Us About Yourself</h1>
                        <p> Help us create the perfect plan for you   </p>

                        <form onSubmit={handleQuestionnaire} className="space-y-5">
                            <Select
                                id="goal"
                                label="What is your primary fitness goal?"
                                options={goalOptions}
                                value={formData.goal}
                                onChange={(e) => updateFormData("goal", e.target.value)}
                            />
                            <Select
                                id="experience"
                                label="What is your current fitness experience level?"
                                options={experienceOptions}
                                value={formData.goal}
                                onChange={(e) => updateFormData("experience", e.target.value)}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Select
                                    id="daysPerWeek"
                                    label="days per week "
                                    options={daysOptions}
                                    value={formData.daysPerWeek}
                                    onChange={(e) => updateFormData("daysPerWeek", e.target.value)}
                                />

                                <Select
                                    id="sessionLength"
                                    label="How long are your workout ?"
                                    options={sessionsOptions}
                                    value={formData.sessionLength}
                                    onChange={(e) => updateFormData("sessionLength", e.target.value)}
                                />
                            </div>



                            <Select
                                id="equipment"
                                label="What type of equipment do you have access to?"
                                options={equipmentOptions}
                                value={formData.equipment}
                                onChange={(e) => updateFormData("equipment", e.target.value)}
                            />

                            <Select
                                id="splitPreference"
                                label="Do you have a preferred workout split?"
                                options={splitOptions}
                                value={formData.splitPreference}
                                onChange={(e) => updateFormData("splitPreference", e.target.value)}
                            />

                            <Textarea
                                id="injuries"
                                label="Any injuries or limitations? (optional)"
                                placeholder="lower back issues, shoulder issues"
                                rows={3}
                                value={formData.injuries}
                                onChange={(e) => updateFormData("injuries", e.target.value)}
                            />

                            <div className="flex gap-4 label-float-right">
                                <Button className="flex-1 gap-2" type="submit">
                                    Generate my plan <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>

                        </form>

                    </Card>



                    { /* Step 2: Personal Information */}





                </div>
            </div>

        </SignedIn>
    )
}
