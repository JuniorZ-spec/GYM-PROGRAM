interface StepperProps {
    steps: string[];
    currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
                {steps.map((label, index) => {
                    const stepNumber = index + 1;
                    const active = stepNumber <= currentStep;
                    return (
                        <div key={label} className="flex-1 flex items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-colors ${
                                    active
                                        ? "bg-[var(--color-accent)] text-[var(--color-accent-foreground)]"
                                        : "bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-muted)]"
                                }`}
                            >
                                {stepNumber}
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={`flex-1 h-0.5 mx-2 rounded transition-colors ${
                                        stepNumber < currentStep ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]"
                                    }`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
            <p className="text-sm text-[var(--color-muted)]">
                Étape {currentStep} / {steps.length} — {steps[currentStep - 1]}
            </p>
        </div>
    );
}
