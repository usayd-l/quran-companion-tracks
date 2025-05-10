
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthState } from "@/types";
import {
  initializeLocalStorage,
  authenticateUser,
  saveUser,
  saveCurrentUser,
  getCurrentUser,
} from "@/services/localStorage";
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";

interface AuthContextProps {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'student' | 'teacher') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    // Initialize localStorage with demo data
    initializeLocalStorage();
    
    // Check for saved auth
    const savedUser = getCurrentUser();
    if (savedUser) {
      setAuthState({
        isAuthenticated: true,
        user: savedUser,
        loading: false,
      });
    } else {
      setAuthState({ isAuthenticated: false, user: null, loading: false });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Authenticate user
      const user = authenticateUser(email, password);
      if (!user) {
        throw new Error("Invalid credentials");
      }
      
      // Store user in localStorage
      saveCurrentUser(user);
      
      setAuthState({
        isAuthenticated: true,
        user,
        loading: false,
      });
    } catch (error) {
      console.error("Login error", error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string, role: 'student' | 'teacher') => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create new user
      const newUser: User = {
        id: uuidv4(),
        name,
        role,
        email,
        password,
        profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${role === 'teacher' ? 'D3B88C' : 'E9F0E6'}&color=${role === 'teacher' ? '2D2A26' : '4A6741'}`
      };
      
      // Save user to "database"
      saveUser(newUser);
      
      // Store user in localStorage
      saveCurrentUser(newUser);
      
      setAuthState({
        isAuthenticated: true,
        user: newUser,
        loading: false,
      });
    } catch (error) {
      console.error("Signup error", error);
      throw error;
    }
  };

  const logout = () => {
    saveCurrentUser(null);
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
