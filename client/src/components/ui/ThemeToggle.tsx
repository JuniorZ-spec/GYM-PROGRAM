import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/useTheme";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label="Changer de thème"
            className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] hover:border-[var(--color-accent)] transition-colors cursor-pointer"
        >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
    );
}
