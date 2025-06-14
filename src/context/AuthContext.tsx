
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { AuthState } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuthContextProps {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'student' | 'teacher') => Promise<void>;
  loginDemo: (role: 'student' | 'teacher') => void;
  logout: () => void;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Demo users for testing
const demoUsers = {
  teacher: {
    id: "demo-teacher-id",
    name: "Demo Teacher",
    email: "teacher@demo.com",
    role: "teacher" as const,
    profileImage: "https://ui-avatars.com/api/?name=Demo+Teacher&background=D3B88C&color=2D2A26"
  },
  student: {
    id: "demo-student-id", 
    name: "Demo Student",
    email: "student@demo.com",
    role: "student" as const,
    profileImage: "https://ui-avatars.com/api/?name=Demo+Student&background=E9F0E6&color=4A6741"
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });
  const [isDemoMode, setIsDemoMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check for demo mode first
    const demoUser = localStorage.getItem('demoUser');
    if (demoUser) {
      try {
        const user = JSON.parse(demoUser);
        setAuthState({
          isAuthenticated: true,
          user,
          loading: false,
        });
        setIsDemoMode(true);
        return;
      } catch (error) {
        localStorage.removeItem('demoUser');
      }
    }

    // Set up auth state listener for Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          // Fetch user profile from our profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            const user = {
              id: profile.id,
              name: profile.name,
              role: profile.role,
              email: session.user.email || '',
              profileImage: profile.profile_image
            };

            setAuthState({
              isAuthenticated: true,
              user,
              loading: false,
            });
            setIsDemoMode(false);
          }
        } else {
          setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
          });
          setIsDemoMode(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setAuthState({ isAuthenticated: false, user: null, loading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Login error", error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string, role: 'student' | 'teacher') => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
            role,
            profile_image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${role === 'teacher' ? 'D3B88C' : 'E9F0E6'}&color=${role === 'teacher' ? '2D2A26' : '4A6741'}`
          }
        }
      });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Signup error", error);
      throw error;
    }
  };

  const loginDemo = (role: 'student' | 'teacher') => {
    const user = demoUsers[role];
    localStorage.setItem('demoUser', JSON.stringify(user));
    setAuthState({
      isAuthenticated: true,
      user,
      loading: false,
    });
    setIsDemoMode(true);
    
    toast({
      title: "Demo Mode",
      description: `Logged in as Demo ${role === 'teacher' ? 'Teacher' : 'Student'}`,
    });
  };

  const logout = async () => {
    if (isDemoMode) {
      localStorage.removeItem('demoUser');
      setIsDemoMode(false);
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    } else {
      await supabase.auth.signOut();
    }
  };

  return (
    <AuthContext.Provider value={{ authState, login, signup, loginDemo, logout, isDemoMode }}>
      {children}
    </AuthContext.Provider>
  );
};
