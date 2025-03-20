
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

  // Separate function to check admin status that can be called independently
  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('Checking admin status for user ID:', userId);
      
      // Check if profile exists before checking admin status
      const { data: profileExists, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();
        
      if (profileCheckError) {
        console.error('Error checking if profile exists:', profileCheckError);
        setIsAdmin(false);
        return;
      }
      
      // If profile doesn't exist yet, wait and try again (could happen right after signup)
      if (!profileExists) {
        console.log('Profile not found, waiting for it to be created...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
      // Now check for admin status
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
    console.log('AuthProvider mounted');
    let mounted = true;
    
    const initAuth = async () => {
      try {
        setIsLoading(true);
        
        // First, set up the listener for auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            console.log(`Auth state changed: ${event}`, newSession?.user?.email);
            
            if (!mounted) return;
            
            if (newSession) {
              setSession(newSession);
              setUser(newSession.user);
              
              // Check admin status whenever we get a new session
              if (newSession.user) {
                await checkAdminStatus(newSession.user.id);
              }
            } else {
              setSession(null);
              setUser(null);
              setIsAdmin(false);
            }
          }
        );
        
        // Then get the current session
        const { data: currentSession, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting current session:', sessionError);
          if (mounted) setIsLoading(false);
          return;
        }
        
        if (currentSession?.session && mounted) {
          console.log('Current session found:', currentSession.session.user?.email);
          setSession(currentSession.session);
          setUser(currentSession.session.user);
          
          // Check admin status on initial load if we have a session
          if (currentSession.session.user) {
            await checkAdminStatus(currentSession.session.user.id);
          }
        } else {
          console.log('No current session found');
        }
        
        if (mounted) setIsLoading(false);
        
        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) setIsLoading(false);
      }
    };
    
    initAuth();
    
    return () => {
      console.log('AuthProvider unmounting');
      mounted = false;
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      console.log("Attempting sign in for user:", email);
      
      // First sign out to ensure clean state
      await supabase.auth.signOut();
      
      // Attempt to sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Sign in error:", error.message);
        
        // Display friendly error message based on error type
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Login Failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive"
          });
        } else if (
          error.message.includes("confirmation_token") || 
          error.message.includes("Database error") ||
          error.message.includes("sql: Scan error")
        ) {
          toast({
            title: "System Error",
            description: "There was a temporary database issue. Please try again in a moment.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Login Error",
            description: error.message,
            variant: "destructive"
          });
        }
        
        throw error;
      }
      
      console.log("Sign in successful for:", data.user?.email);
      
      // Set session and user if login successful
      setSession(data.session);
      setUser(data.user);
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.user?.email}!`,
      });
      
      // Check admin status after successful login
      if (data.user) {
        await checkAdminStatus(data.user.id);
      }
    } catch (error) {
      console.error("Sign in exception:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error.message);
        toast({
          title: "Sign Out Error",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      // Reset state after successful sign out
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error("Sign out exception:", error);
      throw error;
    } finally {
      setIsLoading(false);
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
