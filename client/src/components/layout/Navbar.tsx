import { Link } from "react-router-dom"
import { Dumbbell, LayoutDashboard, Settings } from "lucide-react"
import { Button } from "../ui/Button"
import { ThemeToggle } from "../ui/ThemeToggle"
import { useAuth } from "../../context/useAuth";
import { UserButton } from "@neondatabase/neon-js/auth/react/ui";



export default function Navbar() {

    const { user } = useAuth();

    return (

        <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-background)]/80 backdrop-blur-md">

            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between text-[var(--color-foreground)]">
                <Link to="/" className="flex items-center gap-2 text-[var(--color-foreground)]" >
                    <Dumbbell className="w-7 h-7 text-[var(--color-accent)]" />
                    <span className="font-bold text-xl">YM</span>
                </Link>

                <nav className="flex items-center gap-2">
                    {user ? (<>
                        <Link to="/dashboard">
                            <Button variant="ghost" size="sm" className="gap-1.5">
                                <LayoutDashboard className="w-4 h-4" /> Tableau de bord
                            </Button>
                        </Link>
                        <Link to="/settings">
                            <Button variant="ghost" size="sm" className="gap-1.5">
                                <Settings className="w-4 h-4" /> Paramètres
                            </Button>
                        </Link>
                        <ThemeToggle />
                        <UserButton />
                    </>) : (
                        <>
                            <ThemeToggle />
                            <Link to="/auth/sign-in">
                                <Button variant="ghost" size="sm"> Se connecter</Button>
                            </Link>
                            <Link to="/auth/sign-up">
                                <Button size="sm"> S'inscrire</Button>
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    )
}
