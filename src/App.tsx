
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { initializeLocalStorage } from "./services/localStorage";
import AuthLoadingScreen from "./components/ui/AuthLoadingScreen";
import Index from "./pages/Index";
import CreateLog from "./pages/CreateLog";
import ViewLog from "./pages/ViewLog";
import AllLogs from "./pages/AllLogs";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Initialize localStorage with demo data
initializeLocalStorage();

// Create query client outside of component to avoid recreation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { authState, isLoggingOut } = useAuth();
  
  if (authState.loading || isLoggingOut) {
    return <AuthLoadingScreen />;
  }
  
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isLoggingOut } = useAuth();
  
  if (isLoggingOut) {
    return <AuthLoadingScreen />;
  }
  
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/create-log" element={<ProtectedRoute><CreateLog /></ProtectedRoute>} />
      <Route path="/create-log/:studentId" element={<ProtectedRoute><CreateLog /></ProtectedRoute>} />
      <Route path="/log/:logId" element={<ProtectedRoute><ViewLog /></ProtectedRoute>} />
      <Route path="/all-logs" element={<ProtectedRoute><AllLogs /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/profile/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      
      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <AppRoutes />
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
