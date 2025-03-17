
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
        console.log('Initializing auth...');
        
        // Get the current session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Initial session error:', error);
          return;
        }
        
        console.log('Initial session data:', data);
        
        if (mounted && data.session) {
          setSession(data.session);
          setUser(data.session.user);
          console.log('User authenticated:', data.session.user?.email);
          
          if (data.session.user) {
            await checkAdminStatus(data.session.user.id);
          }
        } else {
          console.log('No active session found');
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
      console.log('No user ID provided for admin check');
      setIsAdmin(false);
      return;
    }

    try {
      console.log('Checking admin status for user ID:', userId);
      
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
      const isUserAdmin = data?.role === 'admin';
      console.log(`User admin status: ${isUserAdmin ? 'ADMIN' : 'NOT ADMIN'}`);
      setIsAdmin(isUserAdmin);
      
      // Debugging
      if (!isUserAdmin && data) {
        console.warn(`User has role "${data.role}" instead of "admin"`);
      }
    } catch (error) {
      console.error('Exception in admin status check:', error);
      setIsAdmin(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      console.log("Attempting sign in for user:", email);
      
      // First try to sign up the user if they don't exist yet (for test/demo purposes)
      if (email === 'admin@test.com' && password === 'password123') {
        const { data: checkData, error: checkError } = await supabase.auth.signInWithPassword({
          email, password
        });
        
        if (checkError && checkError.message.includes('Invalid login')) {
          console.log('Admin user does not exist, creating...');
          
          // Try to create the admin user if login fails
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email, password
          });
          
          if (signUpError) {
            console.error("Sign up error:", signUpError);
            throw signUpError;
          }
          
          if (signUpData.user) {
            console.log("Admin user created successfully:", signUpData.user.email);
            
            // Set admin role in profiles table
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ role: 'admin' })
              .eq('id', signUpData.user.id);
              
            if (updateError) {
              console.error("Error setting admin role:", updateError);
            }
          }
        }
      }
      
      // Now proceed with normal sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Sign in error:", error);
        throw error;
      }
      
      console.log("Sign in successful for:", data.user?.email);
      console.log("Session:", data.session);
      
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
        console.error("Sign out error:", error);
        throw error;
      }
      
      // Reset states after sign out
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      
      console.log("User signed out successfully");
      
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
