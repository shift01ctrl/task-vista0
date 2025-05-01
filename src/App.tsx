
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { TaskProvider } from "./context/TaskContext";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Pages
import Dashboard from "./pages/Dashboard";
import CardView from "./pages/CardView";
import CalendarView from "./pages/CalendarView";
import TableView from "./pages/TableView";
import TimelineView from "./pages/TimelineView";
import UsersPage from "./pages/UsersPage";
import TeamsPage from "./pages/TeamsPage";
import SearchPage from "./pages/SearchPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

// For demo purposes, we'll use this to simulate authentication
const isAuthenticated = () => {
  return localStorage.getItem("isAuthenticated") === "true";
};

const LoadingScreen = () => (
  <motion.div 
    className="min-h-screen flex flex-col items-center justify-center bg-background"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="loader"></div>
    <p className="mt-4 text-lg text-foreground">Loading...</p>
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/tasks" element={<PrivateRoute><CardView /></PrivateRoute>} />
        <Route path="/calendar" element={<PrivateRoute><CalendarView /></PrivateRoute>} />
        <Route path="/table" element={<PrivateRoute><TableView /></PrivateRoute>} />
        <Route path="/timeline" element={<PrivateRoute><TimelineView /></PrivateRoute>} />
        <Route path="/users" element={<PrivateRoute><UsersPage /></PrivateRoute>} />
        <Route path="/teams" element={<PrivateRoute><TeamsPage /></PrivateRoute>} />
        <Route path="/search" element={<PrivateRoute><SearchPage /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return isAuthenticated() ? (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  ) : (
    <Navigate to="/login" />
  );
};

const queryClient = new QueryClient();

const App = () => {
  // Check for saved theme preference and apply it
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    
    if (savedTheme === "dark" || 
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <TaskProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </TaskProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
