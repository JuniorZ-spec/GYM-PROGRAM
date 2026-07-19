import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    suffix?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', label, error, suffix, id, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label htmlFor={id} className="text-sm font-medium text-[var(--color-foreground)]">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        ref={ref}
                        id={id}
                        className={`w-full px-4 py-2.5 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors ${suffix ? 'pr-12' : ''} ${className}`}
                        {...props}
                    />
                    {suffix && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--color-muted)]">
                            {suffix}
                        </span>
                    )}
                </div>
                {error && <span className="text-sm text-red-500">{error}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';
