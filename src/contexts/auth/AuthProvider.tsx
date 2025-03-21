
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
  const [authInitialized, setAuthInitialized] = useState(false);
  
  const { isAdmin, setIsAdmin, checkAdminStatus } = useAdminCheck();
  const { signIn, signOut } = useAuthActions({
    setIsLoading,
    setSession,
    setUser,
    setIsAdmin,
    checkAdminStatus
  });

  // Auth initialization
  useEffect(() => {
    console.log('AuthProvider mounted');
    let mounted = true;
    
    async function initAuth() {
      try {
        setIsLoading(true);
        
        // Step 1: Aggressively clear all auth-related localStorage items
        console.log('Thorough cleanup of browser storage...');
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('supabase') || key.includes('sb-'))) {
            keysToRemove.push(key);
          }
        }
        
        // Remove identified keys
        keysToRemove.forEach(key => {
          console.log('Removing stale auth key:', key);
          localStorage.removeItem(key);
        });
        
        // Step 2: Force a clean slate by signing out globally first
        try {
          const { error } = await supabase.auth.signOut({ scope: 'global' });
          if (error) {
            console.warn('Error during initial signout:', error);
          } else {
            console.log('Successfully cleared any existing sessions');
          }
        } catch (e) {
          console.warn('Exception during initial signout (expected if no session):', e);
        }
        
        // Step 3: Wait longer for signout to complete
        console.log('Waiting for auth state to fully clear...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log('Starting fresh authentication check...');
        
        // Step 4: Set up auth state change listener before checking session
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            console.log(`Auth state changed: ${event}`, newSession?.user?.email);
            
            if (!mounted) return;
            
            if (newSession) {
              setSession(newSession);
              setUser(newSession.user);
              
              // Check admin status on auth state change
              if (newSession.user) {
                try {
                  await checkAdminStatus(newSession.user.id);
                } catch (adminCheckError) {
                  console.error('Admin check error:', adminCheckError);
                }
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
        
        // Step 5: Check for existing session with error handling
        try {
          console.log('Checking for existing session...');
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Error getting current session:', error);
            toast({
              title: "Authentication Error",
              description: "There was a problem connecting to the authentication service.",
              variant: "destructive"
            });
            if (mounted) {
              setIsLoading(false);
              setAuthInitialized(true);
            }
            return;
          }
          
          // Set the session and user if we have one
          if (mounted && data.session) {
            console.log('Current session found:', data.session.user?.email);
            setSession(data.session);
            setUser(data.session.user);
            
            // Check admin status if user exists
            if (data.session.user) {
              try {
                await checkAdminStatus(data.session.user.id);
              } catch (adminCheckError) {
                console.error('Admin check error:', adminCheckError);
              }
            }
          } else {
            console.log('No current session found');
          }
        } catch (fetchSessionError) {
          console.error('Exception getting session:', fetchSessionError);
          if (mounted) {
            toast({
              title: "Session Error",
              description: "Failed to check your login status. Please refresh the page.",
              variant: "destructive"
            });
          }
        }
        
        // Finalize initialization
        if (mounted) {
          setIsLoading(false);
          setAuthInitialized(true);
        }
        
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
        if (mounted) {
          setIsLoading(false);
          setAuthInitialized(true);
        }
      }
    }
    
    initAuth();
    
    return () => {
      console.log('AuthProvider unmounting');
      mounted = false;
    };
  }, []);

  // Provide clear feedback on auth status
  const contextValue: AuthContextType = {
    session, 
    user, 
    signIn, 
    signOut, 
    isLoading, 
    isAdmin,
    isAuthInitialized: authInitialized
  };

  return (
    <AuthContext.Provider value={contextValue}>
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
