
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
      
      // Clean up any stale auth data
      for (const key of Object.keys(localStorage)) {
        if (key.includes('supabase') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      }
      
      // Clear any existing session first
      await supabase.auth.signOut();
      
      // Attempt login with improved error handling
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Login error:", error);
        
        // Handle common error scenarios
        if (error.message?.includes("Database error") || 
            error.message?.includes("confirmation_token")) {
          throw new Error("Supabase connection error. Please check your network and try again.");
        }
        
        // Handle invalid credentials specifically
        if (error.message?.includes("Invalid login credentials")) {
          throw new Error("Invalid email or password. Please try again.");
        }
        
        throw error;
      }
      
      if (!data.session || !data.user) {
        throw new Error("Login failed: No session data returned");
      }
      
      console.log("Sign in successful for:", data.user.email);
      
      // Set session and user
      setSession(data.session);
      setUser(data.user);
      
      // Check admin status
      await checkAdminStatus(data.user.id);
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.user.email}!`,
      });
      
    } catch (error: any) {
      console.error("Sign in exception:", error);
      
      toast({
        title: "Login Failed",
        description: error.message || "Authentication error. Please try again.",
        variant: "destructive"
      });
      
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
      
      // Reset state
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      
      // Clear local storage
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
