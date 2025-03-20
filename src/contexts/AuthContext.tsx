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

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('Checking admin status for user ID:', userId);
      
      // Add a longer delay to ensure the profile has been created
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      console.log("Admin check result:", data, "Error:", error);
      
      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return;
      }
      
      const isUserAdmin = data?.role === 'admin';
      console.log(`User admin status: ${isUserAdmin ? 'ADMIN' : 'NOT ADMIN'}`);
      setIsAdmin(isUserAdmin);
    } catch (error) {
      console.error('Exception in admin status check:', error);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    let isActive = true;
    
    const initializeAuth = async () => {
      try {
        if (!isActive) return;
        
        setIsLoading(true);
        console.log('Initializing auth...');
        
        // First, set up the listener for future auth state changes
        // Keeping reference to subscription for cleanup
        const subscription = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            console.log(`Auth state changed: ${event}`, newSession?.user?.email);
            
            if (!isActive) return;
            
            setSession(newSession);
            setUser(newSession?.user || null);
            
            if (newSession?.user) {
              await checkAdminStatus(newSession.user.id);
            } else {
              setIsAdmin(false);
            }
          }
        );

        // Then check the current session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Initial session error:', error);
          setIsLoading(false);
          return;
        }
        
        if (data.session && isActive) {
          console.log('Existing session found for:', data.session.user?.email);
          setSession(data.session);
          setUser(data.session.user);
          
          if (data.session.user) {
            await checkAdminStatus(data.session.user.id);
          }
        } else {
          console.log('No existing session found');
        }
        
        if (isActive) {
          setIsLoading(false);
        }
        
        // Cleanup function
        return () => {
          isActive = false;
          subscription.unsubscribe();
        };
        
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();
    
    return () => {
      isActive = false;
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      console.log("Attempting sign in for user:", email);
      
      // First sign out to clear any potentially corrupted session
      await supabase.auth.signOut();
      
      // Then attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email, 
        password
      });
      
      if (error) {
        console.error("Sign in error:", error.message);
        
        // Handle database error specifically
        if (error.message.includes("confirmation_token") || 
            error.message.includes("Database error") ||
            error.message.includes("sql: Scan error")) {
          toast({
            title: "Authentication Error",
            description: "There was a database issue with authentication. Please try again in a moment.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Authentication Error",
            description: error.message,
            variant: "destructive"
          });
        }
        throw error;
      }
      
      console.log("Sign in successful for:", data.user?.email);
      
      setSession(data.session);
      setUser(data.user);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user?.email}!`,
      });
      
      // Update admin status after successful login
      if (data.user) {
        await checkAdminStatus(data.user.id);
      }
    } catch (error: any) {
      console.error("Sign in exception:", error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Reset states after sign out
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
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
