import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../types";
import { authClient } from "../lib/auth";


interface AuthContextType {
    user: User | null;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);


export default function AuthProvider({ children }: { children: ReactNode }) {
    const [neonUser, setNeonUser] = useState<User | null>(null);
    const [isloading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            try {
                const result = await authClient.getSession();
                if (result && result.data?.user) {
                    setNeonUser(result.data.user);
                } else {
                    setNeonUser(null);
                }

            } catch (error) {
                setNeonUser(null);
            }
            finally {
                setIsLoading(false);
            }
        }
        loadUser();
    }, []);

    return (<AuthContext.Provider value={{ user: neonUser }}>
        {children}
    </AuthContext.Provider>)
}


export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}


