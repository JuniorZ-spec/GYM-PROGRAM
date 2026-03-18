import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";



export default function Account() {

    const { user, isLoading } = useAuth();
    const plan = false; // Replace with actual logic to check if the user has a plan

    if (!user && !isLoading) {
        return <Navigate to="/auth/sign-in" replace />
    }

    if (!plan) {
        return <Navigate to="/onboarding" replace />
    }

    return (<div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Account</h1>
        <p>This is the account page.</p>
    </div>)
}