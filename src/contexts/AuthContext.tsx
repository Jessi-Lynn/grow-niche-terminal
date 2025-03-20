
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

  // Separate function to check admin status
  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('Checking admin status for user ID:', userId);
      
      // Check admin status using maybeSingle to avoid errors
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
    
    async function initAuth() {
      try {
        setIsLoading(true);
        
        // Get the initial session
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting current session:', sessionError);
          if (mounted) setIsLoading(false);
          return;
        }
        
        // Set the session and user if we have one
        if (mounted && currentSession) {
          console.log('Current session found:', currentSession.user?.email);
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Check admin status if user exists
          if (currentSession.user) {
            await checkAdminStatus(currentSession.user.id);
          }
        } else {
          console.log('No current session found');
        }
        
        // Set up the auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            console.log(`Auth state changed: ${event}`, newSession?.user?.email);
            
            if (!mounted) return;
            
            if (newSession) {
              setSession(newSession);
              setUser(newSession.user);
              
              // Check admin status on auth state change
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
        
        // Clean up the loading state
        if (mounted) setIsLoading(false);
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) setIsLoading(false);
      }
    }
    
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
      
      // First sign out to ensure clean state - this helps avoid the confirmation_token error
      await supabase.auth.signOut();
      
      // Wait a moment to ensure the signout is processed
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Attempt to sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Sign in error:", error.message);
        
        // Display friendly error message
        toast({
          title: "Login Failed",
          description: error.message.includes("Invalid login credentials") 
            ? "Invalid email or password. Please try again."
            : "An error occurred during login. Please try again.",
          variant: "destructive"
        });
        
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
