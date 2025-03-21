
import { Dispatch, SetStateAction } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface UseAuthActionsProps {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setSession: Dispatch<SetStateAction<Session | null>>;
  setUser: Dispatch<SetStateAction<User | null>>;
  setIsAdmin: Dispatch<SetStateAction<boolean>>;
  checkAdminStatus: (userId: string) => Promise<void>;
}

export const useAuthActions = ({
  setIsLoading,
  setSession,
  setUser,
  setIsAdmin,
  checkAdminStatus
}: UseAuthActionsProps) => {
  
  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      console.log("Attempting sign in for user:", email);
      
      // Step 1: Thoroughly clean localStorage to prevent token conflicts
      console.log("Thoroughly cleaning localStorage...");
      for (const key of Object.keys(localStorage)) {
        if (key.includes('supabase') || key.includes('sb-')) {
          console.log(`Removing key: ${key}`);
          localStorage.removeItem(key);
        }
      }
      
      // Step 2: Force a global signout with retry mechanism
      console.log("Performing global signout...");
      try {
        await supabase.auth.signOut({ scope: 'global' });
        console.log("Global signout successful");
      } catch (signOutErr) {
        console.warn("Initial signout error (continuing anyway):", signOutErr);
      }
      
      // Step 3: Wait 5 seconds to ensure complete auth state reset
      // This is critical to resolve the confirmation_token error
      console.log("Waiting for auth state to fully clear (5s)...");
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Step 4: One more localStorage cleanup after the wait
      console.log("Final localStorage cleanup...");
      for (const key of Object.keys(localStorage)) {
        if (key.includes('supabase') || key.includes('sb-')) {
          console.log(`Removing key: ${key}`);
          localStorage.removeItem(key);
        }
      }
      
      console.log("Auth state should now be fully reset, attempting login...");
      
      // Step 5: Attempt login with simplified parameters
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Sign in error:", error.message, error);
        
        // Display friendly error message
        toast({
          title: "Login Failed",
          description: error.message.includes("Invalid login credentials") 
            ? "Invalid email or password. Please try again."
            : `Authentication error: ${error.message}. Please try again later.`,
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
      
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
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
      
      // Clear any remaining local storage items
      for (const key of Object.keys(localStorage)) {
        if (key.includes('supabase') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      }
      
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

  return {
    signIn,
    signOut
  };
};
