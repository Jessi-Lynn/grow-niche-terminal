
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
      
      // First, completely clear all local storage auth data
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('supabase.auth.expires_at');
      localStorage.removeItem('supabase.auth.expires_in');
      
      // Explicitly sign out to clear any existing sessions
      await supabase.auth.signOut({ scope: 'global' });
      
      // Extended wait time to ensure proper cleaning of sessions
      // This is critical for avoiding the confirmation_token error
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("Clean state established, attempting login...");
      
      // Now attempt to sign in with email and password
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
