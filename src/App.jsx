import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sidebar } from "./components/shared/Sidebar";
import { MobileNav } from "./components/shared/MobileNav";
import { MobileHeader } from "./components/shared/MobileHeader";
import { CommandPalette } from "./components/shared/CommandPalette";
import { ProtectedRoute } from "./components/shared/ProtectedRoute";
import { GuestRoute } from "./components/shared/GuestRoute";
import { DashboardLoader } from "./components/shared/DashboardLoader";
import { Toaster } from "@/components/ui/sonner";
import { PrivacyProvider } from "@/contexts/PrivacyContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Transactions from "./pages/Transactions";
import Categories from "./pages/Categories";
import Budgets from "./pages/Budgets";
import Goals from "./pages/Goals";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";

import { useAuth } from "@/hooks/useAuth";

function AuthenticatedLayout({ theme, toggleTheme }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { justLoggedIn, clearJustLoggedIn } = useAuth();

  const [activeTrigger, setActiveTrigger] = useState(
    () => justLoggedIn || !!location.state?.showLoader
  );

  const shouldShowLoader = activeTrigger || justLoggedIn || !!location.state?.showLoader;

  useEffect(() => {
    if (location.state?.showLoader) {
      navigate(location.pathname, { replace: true, state: {} });
    }
    window.scrollTo(0, 0);
  }, [location.state, location.pathname, navigate]);

  const handleLoaderComplete = () => {
    setActiveTrigger(false);
    clearJustLoggedIn();
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
      {shouldShowLoader && (
        <DashboardLoader onComplete={handleLoaderComplete} />
      )}
      <Sidebar theme={theme} toggleTheme={toggleTheme} />
      <MobileHeader />
      <MobileNav theme={theme} toggleTheme={toggleTheme} />
      <CommandPalette theme={theme} toggleTheme={toggleTheme} />

      <div className="md:pl-64 flex flex-col flex-1 min-h-screen">
        <main className="flex-1 p-4 md:p-8 max-w-[1400px] w-full mx-auto space-y-6 pb-24 md:pb-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <LanguageProvider>
      <PrivacyProvider>
        <Routes>
          <Route path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />

          <Route path="/*"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout theme={theme} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster position="top-center" />
      </PrivacyProvider>
    </LanguageProvider>
  );
}
