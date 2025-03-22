
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
      
      // Step 1: Clean localStorage to prevent token conflicts
      console.log("Cleaning localStorage...");
      for (const key of Object.keys(localStorage)) {
        if (key.includes('supabase') || key.includes('sb-')) {
          console.log(`Removing key: ${key}`);
          localStorage.removeItem(key);
        }
      }
      
      // Step 2: Force a global signout
      console.log("Performing global signout...");
      try {
        await supabase.auth.signOut({ scope: 'global' });
        console.log("Global signout successful");
      } catch (signOutErr) {
        console.warn("Initial signout error (continuing anyway):", signOutErr);
      }
      
      // Give a short pause to ensure auth state is clear
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Attempting login...");
      
      // Attempt login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        // Handle database errors consistently
        if (error.message?.includes("Database error") || 
            error.message?.includes("confirmation_token")) {
          console.error("Database connection error:", error);
          throw new Error("Authentication service error. Please try again in a moment.");
        }
        throw error;
      }
      
      if (!data.session || !data.user) {
        throw new Error("Login failed: No session or user data returned");
      }
      
      console.log("Sign in successful for:", data.user.email);
      
      // Set session and user immediately
      setSession(data.session);
      setUser(data.user);
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.user.email}!`,
      });
      
      // Check admin status after successful login
      try {
        console.log("Checking admin status for user:", data.user.id);
        await checkAdminStatus(data.user.id);
      } catch (adminCheckError) {
        console.error("Error checking admin status:", adminCheckError);
        // Don't throw here, just log the error
      }
      
    } catch (error: any) {
      console.error("Sign in exception:", error);
      handleAuthError(error);
      throw error; // Re-throw for the login page to handle
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthError = (error: any) => {
    console.error("Auth error:", error);
    
    // Simplified error messages
    toast({
      title: "Login Failed",
      description: error.message || "Authentication error. Please try again.",
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
