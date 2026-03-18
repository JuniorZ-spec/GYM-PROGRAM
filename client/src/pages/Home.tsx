import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";





export default function Home() {


    const { user, isLoading } = useAuth();


    if (!user && !isLoading) {
        return <Navigate to="/profile" />
    }




    return (

        <div className="p-4">    </div>)
}