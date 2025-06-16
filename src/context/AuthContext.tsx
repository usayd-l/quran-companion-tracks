import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, User, UserRole } from '@/types';
import { supabase } from '@/lib/supabase';
import { getUserById } from '@/services/supabaseService';

interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
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

  useEffect(() => {
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
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ authState, login, signup, logout }}>
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
