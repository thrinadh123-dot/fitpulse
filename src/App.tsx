import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "@/hooks/useUser";
import { ThemeProvider } from "@/hooks/useTheme";
import { initializeFitnessStore } from "@/stores/fitnessStore";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ProfileSetup from "@/pages/ProfileSetup";
import GoalSelection from "@/pages/GoalSelection";
import EnhancedOnboarding from "@/pages/EnhancedOnboarding";
import Dashboard from "@/pages/Dashboard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Nutrition from "@/pages/Nutrition";
import Fitness from "@/pages/Fitness";
import Water from "@/pages/Water";
import Sleep from "@/pages/Sleep";
import Settings from "@/pages/Settings";
import Profile from "@/pages/Profile";
import DishCalculatorPage from "@/pages/DishCalculatorPage";
import MedicalCheckup from "@/pages/MedicalCheckup";
import NotFound from "@/pages/NotFound";
import { Toaster as HotToaster } from "react-hot-toast";
const queryClient = new QueryClient();

const App = () => {
  // Initialize the fitness store when the app starts
  useEffect(() => {
    initializeFitnessStore();
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <HotToaster />
          <Routes>
              {/* Public routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
              </Route>

              {/* Auth routes - accessible only when not authenticated */}
              <Route
                path="/login"
                element={
                  <ProtectedRoute requireAuth={false}>
                    <Login />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <ProtectedRoute requireAuth={false}>
                    <Register />
                  </ProtectedRoute>
                }
              />

              {/* Onboarding route - requires auth but not onboarding */}
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute requireAuth={true} requireOnboarding={false}>
                    <EnhancedOnboarding />
                  </ProtectedRoute>
                }
              />

              {/* Protected routes - require both auth and completed onboarding */}
              <Route path="/" element={<Layout />}>
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute requireAuth={true} requireOnboarding={true}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="nutrition"
                  element={
                    <ProtectedRoute requireAuth={true} requireOnboarding={true}>
                      <Nutrition />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="fitness"
                  element={
                    <ProtectedRoute requireAuth={true} requireOnboarding={true}>
                      <Fitness />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="water"
                  element={
                    <ProtectedRoute requireAuth={true} requireOnboarding={true}>
                      <Water />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="sleep"
                  element={
                    <ProtectedRoute requireAuth={true} requireOnboarding={true}>
                      <Sleep />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <ProtectedRoute requireAuth={true} requireOnboarding={true}>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <ProtectedRoute requireAuth={true} requireOnboarding={true}>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="dish-calculator"
                  element={
                    <ProtectedRoute requireAuth={true} requireOnboarding={true}>
                      <DishCalculatorPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="medical-checkup"
                  element={
                    <ProtectedRoute requireAuth={true} requireOnboarding={true}>
                      <MedicalCheckup />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
        </TooltipProvider>
      </UserProvider>
    </ThemeProvider>
  </QueryClientProvider>
  );
};

export default App;
