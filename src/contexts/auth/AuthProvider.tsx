
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthContextType } from './types';
import { useAdminCheck } from './useAdminCheck';
import { useAuthActions } from './useAuthActions';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { isAdmin, setIsAdmin, checkAdminStatus } = useAdminCheck();
  const { signIn, signOut } = useAuthActions({
    setIsLoading,
    setSession,
    setUser,
    setIsAdmin,
    checkAdminStatus
  });

  useEffect(() => {
    console.log('AuthProvider mounted');
    let mounted = true;
    
    async function initAuth() {
      try {
        setIsLoading(true);
        
        // CRITICAL: First clear any stale data from browsers
        // This prevents confirmation_token errors
        console.log('Cleaning browser storage...');
        Object.keys(localStorage).forEach(key => {
          if (key.includes('supabase')) {
            console.log('Removing stale auth key:', key);
            localStorage.removeItem(key);
          }
        });
        
        // Force a clean slate by signing out globally first
        try {
          await supabase.auth.signOut({ scope: 'global' });
          console.log('Successfully cleared any existing sessions');
        } catch (e) {
          console.log('Error during initial signout (normal if no session):', e);
        }
        
        // Wait for signout to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Starting fresh authentication check...');
        
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
        
        // Wait a moment before checking the session
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('Checking for existing session...');
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting current session:', sessionError);
          toast({
            title: "Authentication Error",
            description: "There was a problem connecting to the authentication service.",
            variant: "destructive"
          });
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
        
        // Clean up the loading state
        if (mounted) setIsLoading(false);
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        toast({
          title: "Initialization Error",
          description: "There was a problem setting up authentication.",
          variant: "destructive"
        });
        if (mounted) setIsLoading(false);
      }
    }
    
    initAuth();
    
    return () => {
      console.log('AuthProvider unmounting');
      mounted = false;
    };
  }, []);

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
