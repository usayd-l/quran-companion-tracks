
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthState } from "@/types";
import { getUserById } from "@/data/mockData";

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

  useEffect(() => {
    // Check for saved auth in localStorage
    const savedUser = localStorage.getItem("quranCompanionUser");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setAuthState({
          isAuthenticated: true,
          user,
          loading: false,
        });
      } catch (error) {
        console.error("Failed to parse saved user", error);
        localStorage.removeItem("quranCompanionUser");
        setAuthState({ isAuthenticated: false, user: null, loading: false });
      }
    } else {
      setAuthState({ isAuthenticated: false, user: null, loading: false });
    }
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, this would make an API call
    // For now, we'll use mock data
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock user login (would be an API call in a real app)
      const user = getUserById("user1");
      if (!user) {
        throw new Error("Invalid credentials");
      }

      // Add email to the user object
      const authenticatedUser = {
        ...user,
        email
      };
      
      // Store user in localStorage
      localStorage.setItem("quranCompanionUser", JSON.stringify(authenticatedUser));
      
      setAuthState({
        isAuthenticated: true,
        user: authenticatedUser,
        loading: false,
      });
    } catch (error) {
      console.error("Login error", error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string, role: 'student' | 'teacher') => {
    // In a real app, this would make an API call
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create new user (would be an API call in a real app)
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        role,
        email,
      };
      
      // Store user in localStorage
      localStorage.setItem("quranCompanionUser", JSON.stringify(newUser));
      
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
    localStorage.removeItem("quranCompanionUser");
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
