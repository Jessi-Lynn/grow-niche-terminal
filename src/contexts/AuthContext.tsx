
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Initial session fetch
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Fetch the session using the getSession method
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Initial session error:', error);
          return;
        }
        
        if (mounted && data.session) {
          setSession(data.session);
          setUser(data.session.user);
          
          if (data.session.user) {
            await checkAdminStatus(data.session.user.id);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log(`Auth state changed: ${event}`, newSession?.user?.email);
        
        if (mounted) {
          setSession(newSession);
          setUser(newSession?.user || null);
          
          if (newSession?.user) {
            await checkAdminStatus(newSession.user.id);
          } else {
            setIsAdmin(false);
          }
        }
      }
    );
    
    // Cleanup function
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const checkAdminStatus = async (userId: string) => {
    if (!userId) {
      setIsAdmin(false);
      return;
    }

    try {
      console.log("Checking admin status for user ID:", userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return;
      }
      
      console.log("Admin check result:", data);
      setIsAdmin(data?.role === 'admin');
    } catch (error) {
      console.error('Error in admin status check:', error);
      setIsAdmin(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      console.log("Signing in user:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Sign in error:", error);
        throw error;
      }
      
      console.log("Sign in successful for:", data.user?.email);
    } catch (error) {
      console.error("Sign in exception:", error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
        throw error;
      }
      
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Sign out exception:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, signIn, signOut, isLoading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
