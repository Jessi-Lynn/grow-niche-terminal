
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
      
      // Step 5: Attempt login with standard approach
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        // If we hit the confirmation_token error or database error, show specific message
        if (error.message?.includes("confirmation_token") || 
            error.message?.includes("Database error")) {
          console.error("Sign in error with confirmation_token or database error:", error);
          throw new Error("Authentication service temporary error. Please try again in a moment.");
        } else {
          // For other errors, throw the original error
          throw error;
        }
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
        try {
          console.log("Checking admin status for user:", data.user.id);
          await checkAdminStatus(data.user.id);
        } catch (adminCheckError) {
          console.error("Error checking admin status:", adminCheckError);
          // Don't throw here, just log the error - auth is still successful
          // but admin status check failed
        }
      }
      
    } catch (error: any) {
      console.error("Sign in exception:", error);
      handleAuthError(error);
      throw error; // Re-throw to allow login page to handle the error state
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthError = (error: any) => {
    console.error("Auth error:", error);
    
    // Display friendly error message
    toast({
      title: "Login Failed",
      description: error.message?.includes("Invalid login credentials") 
        ? "Invalid email or password. Please try again."
        : error.message?.includes("confirmation_token") || error.message?.includes("Database error")
          ? "Authentication service error. Please try again in a moment."
          : `Authentication error: ${error.message || "Unknown error"}. Please try again later.`,
      variant: "destructive"
    });
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
