import { Link } from "react-router-dom"
import { Dumbbell } from "lucide-react"


export default function Onboarding() {

    return (
        <div>
            <header>
                <div>
                    <Link to="/" className="flex items-center p-4">
                        <Dumbbell />
                        <span className="ml-2 font-bold text-xl">Gym Program App</span>
                    </Link>

                </div>
            </header>
        </div>
    )
}