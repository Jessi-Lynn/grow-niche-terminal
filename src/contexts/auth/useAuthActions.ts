
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
      
      // Simple signIn without the pre-cleanup which can cause issues
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Login error:", error);
        
        // Handle database connection errors
        if (error.message?.includes("Database error")) {
          throw new Error("Authentication service error. Please try again in a moment.");
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
      try {
        await checkAdminStatus(data.user.id);
      } catch (adminCheckError) {
        console.error("Admin check error:", adminCheckError);
        // Continue even if admin check fails - the user is still logged in
      }
      
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
