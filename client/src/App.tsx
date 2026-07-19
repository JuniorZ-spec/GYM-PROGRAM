import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import Settings from "./pages/Settings"
import Account from "./pages/Account"
import Onboarding from "./pages/Onboarding"
import Auth from "./pages/Auth"
import Navbar from "./components/layout/Navbar"
import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth/react';
import { authClient } from "./lib/auth"
import AuthProvider from "./context/AuthContext";
import ThemeProvider from "./context/ThemeContext";


function App() {


  return (
    <ThemeProvider>
      <NeonAuthUIProvider authClient={authClient}>
        <AuthProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/auth/:pathname" element={<Auth />} />
                  <Route path="/account/:pathname" element={<Account />} />
                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </AuthProvider>
      </NeonAuthUIProvider>
    </ThemeProvider>
  )

}
export default App
