import { AccountView, RedirectToSignIn, SignedIn } from "@neondatabase/neon-js/auth/react/ui";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Account() {
    const { pathname } = useParams();
    const { user } = useAuth();

    if (!user) {
        return <RedirectToSignIn />
    }

    return (
        <SignedIn>
            <div className="min-h-screen pt-24 pb-12 px-6 flex items-center justify-center">
                <div className="max-w-lg w-full">
                    <AccountView pathname={pathname} />
                </div>
            </div>
        </SignedIn>
    )
}
