import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { User, UserProfile } from "../types";
import { authClient } from "../lib/auth";
import { api } from "../lib/api";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    saveProfile: (profile: Omit<UserProfile, "userId" | "updatedAt">) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);


export default function AuthProvider({ children }: { children: ReactNode }) {
    const [neonUser, setNeonUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        async function loadUser() {
            try {
                const result = await authClient.getSession();
                if (result && result.data?.user) {
                    setNeonUser(result.data.user);
                } else {
                    setNeonUser(null);
                }
            } catch {
                setNeonUser(null);
            } finally {
                setIsLoading(false);
            }
        }
        loadUser();
    }, []);



    async function saveProfile(
        profileData: Omit<UserProfile, "userId" | "updatedAt">) {
        if (!neonUser) {
            throw new Error("No user logged in");
        }


        await api.saveProfile(neonUser.id, profileData);


    }


    return (
        <AuthContext.Provider value={{ user: neonUser, isLoading, saveProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}
