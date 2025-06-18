
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, User, UserRole } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { getUserById } from '@/services/supabaseService';

interface AuthContextType {
  authState: AuthState;
  isDemoMode: boolean;
  isLoggingOut: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginDemo: (role: 'student' | 'teacher') => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
        console.error('Error parsing demo user:', error);
        localStorage.removeItem('demoUser');
      }
    }

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (session?.user) {
          // Defer profile fetching to avoid potential recursion
          setTimeout(async () => {
            try {
              const userProfile = await getUserById(session.user.id);
              if (userProfile) {
                setAuthState({
                  isAuthenticated: true,
                  user: userProfile,
                  loading: false,
                });
              } else {
                console.warn('No user profile found for authenticated user');
                setAuthState({
                  isAuthenticated: false,
                  user: null,
                  loading: false,
                });
              }
            } catch (error) {
              console.error('Error fetching user profile:', error);
              setAuthState({
                isAuthenticated: false,
                user: null,
                loading: false,
              });
            }
          }, 0);
        } else {
          setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Handle existing session same way as auth state change
        setTimeout(async () => {
          try {
            const userProfile = await getUserById(session.user.id);
            if (userProfile) {
              setAuthState({
                isAuthenticated: true,
                user: userProfile,
                loading: false,
              });
            } else {
              setAuthState({
                isAuthenticated: false,
                user: null,
                loading: false,
              });
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
            setAuthState({
              isAuthenticated: false,
              user: null,
              loading: false,
            });
          }
        }, 0);
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
  };

  const loginDemo = async (role: 'student' | 'teacher') => {
    // Use predefined demo user IDs that match our demo data
    const demoUser: User = role === 'teacher' 
      ? {
          id: "demo-teacher-id",
          name: "Demo Teacher",
          email: "teacher@demo.com",
          role: "teacher",
          profileImage: "https://ui-avatars.com/api/?name=Demo+Teacher&background=D3B88C&color=2D2A26"
        }
      : {
          id: "demo-student-id", 
          name: "Demo Student",
          email: "student@demo.com",
          role: "student",
          classroomId: "demo-classroom-id",
          profileImage: "https://ui-avatars.com/api/?name=Demo+Student&background=E9F0E6&color=4A6741"
        };

    localStorage.setItem('demoUser', JSON.stringify(demoUser));
    setIsDemoMode(true);
    setAuthState({
      isAuthenticated: true,
      user: demoUser,
      loading: false,
    });
  };

  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name,
          role,
        }
      }
    });
    
    if (error) throw error;
  };

  const logout = async () => {
    setIsLoggingOut(true);
    
    if (isDemoMode) {
      localStorage.removeItem('demoUser');
      setIsDemoMode(false);
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    } else {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
    
    setIsLoggingOut(false);
  };

  return (
    <AuthContext.Provider value={{ 
      authState, 
      isDemoMode, 
      isLoggingOut, 
      login, 
      loginDemo, 
      signup, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
